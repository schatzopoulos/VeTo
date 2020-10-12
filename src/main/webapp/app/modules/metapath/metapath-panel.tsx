import React from 'react';
import { Button, Row } from 'reactstrap';
import EntityBox from './entity-box';
import EntityConnector from './entity-connector';
import EntityInsertionModal from './entity-insertion-modal';
import MetapathControl from './metapath-control';
import Recommendation from 'app/modules/metapath/recommendation';

interface MetapathPanelProps {
  constraints: any,
  datasetFolder: string,
  metapath: any
  schema: any
  selectFieldOptions:any
  onNewEntity: any
  onDelete: any
  onRecommendationAccept: any,
  handleSwitch: any,
  handleDropdown: any,
  handleLogicDropdown: any
  handleInput: any
  handleAddition: any
  handleRemoval: any
  handleSelectFieldChange: any
};

class MetapathPanel extends React.Component<MetapathPanelProps> {
  readonly state: any;
  nodes = null;

  constructor(props) {
    super(props);
    if (this.props.schema) {
      this.nodes = this.getAvailableNodesFromSchema(this.props.schema);
    }
    this.state={
      modalOpen:false
    }
  }

  getAvailableNodesFromSchema(schema) {
    return schema.elements.filter(element => element.data.label !== undefined).map(element => {
      return { id: element.data.id, label: element.data.label };
    });
  }

  componentDidMount() {
    if (this.props.schema) {
      this.nodes = this.getAvailableNodesFromSchema(this.props.schema);
    }
  }

  componentDidUpdate() {
    if (this.props.schema) {
      this.nodes = this.getAvailableNodesFromSchema(this.props.schema);
    }
  }

  getMetapathRecommendation(metapathEntities) {
    const metapathString = this.props.metapath.filter(element => element.data('label') !== undefined).map(element => element.data('label')[0]).join('');
    const isSymmetric = (metapathStr) => metapathStr.substr(0, Math.floor(metapathStr.length / 2)).split('').reverse().join('') === metapathStr.substr(Math.ceil(metapathStr.length / 2));
    return isSymmetric(metapathString)? [] : metapathEntities.slice(0, metapathEntities.length - 1).reverse();
  }

  toggleModal() {
    this.setState({
      modalOpen: (!this.state.modalOpen)
    });
  }

  render() {
    if (this.props.metapath && this.props.metapath.length > 0) {
      const idIndexedSchema = {};
      this.props.schema.elements.filter(element => element.data.label!==undefined).forEach(element => {
        idIndexedSchema[element.data.id] = element.data.label;
      });
      const metapathEntities = this.props.metapath.filter(element => element.data('label') !== undefined).map(element => element.data('id'));
      const metapathEntityBoxes = [];
      const metapathTypesSeen = [];
      const tempConstraints = { ...this.props.constraints };

      const recommendationList = this.getMetapathRecommendation(metapathEntities);
      metapathEntities.forEach(element => {
        if (metapathEntityBoxes.length > 0) {
          metapathEntityBoxes.push(<EntityConnector />);
        }
        if (!metapathTypesSeen.includes(element)) {
          metapathTypesSeen.push(element);
          metapathEntityBoxes.push(
            <EntityBox className='' color="dark" disabled entity={element} constraints={tempConstraints[idIndexedSchema[element]]}
                       idIndexedSchema={idIndexedSchema}
                       datasetFolder={this.props.datasetFolder}
                       primaryEntity={metapathEntityBoxes.length === 0}
                       selectFieldOptions={metapathEntityBoxes.length === 0? this.props.selectFieldOptions: null}
                       handleSelectFieldChange={this.props.handleSelectFieldChange}
                       handleSwitch={this.props.handleSwitch}
                       handleDropdown={this.props.handleDropdown}
                       handleLogicDropdown={this.props.handleLogicDropdown}
                       handleInput={this.props.handleInput}
                       handleAddition={this.props.handleAddition}
                       handleRemoval={this.props.handleRemoval} />
          );
          delete tempConstraints[element];
        } else {
          metapathEntityBoxes.push(
            <EntityBox className='' color="dark" disabled entity={element} constraintsControl={false}
                       idIndexedSchema={idIndexedSchema}
                       datasetFolder={null} />
          );
        }
      });
      return (
        <Row className={'overflow-auto flex-nowrap align-items-center metapath-constructor'}>
          {metapathEntityBoxes}
          <MetapathControl schema={this.props.schema} metapath={this.props.metapath}
                           onNewEntity={this.props.onNewEntity} onDelete={this.props.onDelete} />
          <Recommendation
            recommendationEntities={recommendationList}
            idIndexedSchema={idIndexedSchema}
            onRecommendationAccept={this.props.onRecommendationAccept}/>
        </Row>
      );
    } else if (this.nodes) {
      return (
        <Row className={'overflow-auto flex-nowrap align-items-center metapath-constructor'}>
          <Button outline color="dark" size="lg" onClick={this.toggleModal.bind(this)}>Select starting entity</Button>
          {(this.state.modalOpen) &&
          <EntityInsertionModal entities={this.nodes} onSelection={this.props.onNewEntity}
                                onDismiss={this.toggleModal.bind(this)} />}
        </Row>
      );
    } else {
      return <div></div>;
    }
  }
}

export default MetapathPanel;
