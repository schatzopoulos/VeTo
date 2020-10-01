import React from 'react';
import {
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
    Spinner,
    ListGroup,
    Progress,
    Container,
    Card,
    UncontrolledCollapse,
    CustomInput,
    CardBody,
    Label,
    CardTitle,
} from 'reactstrap';
import EntityBox from './entity-box';
import EntityConnector from './entity-connector';
import EntityInsertionModal from './entity-insertion-modal';
import MetapathControl from './metapath-control';

interface MetapathPanelProps {
    // loading: boolean;
    // progress: number;
    // progressMsg: string;
    // error: string;
    // docs: any;
    // meta: any;
    // uuid: string;
    metapath: any
    schema: any
    onNewEntity: any
    onDelete: any
};

class MetapathPanel extends React.Component<MetapathPanelProps> {
    readonly state: any = {
        modalOpen: false
    }
    nodes = null;

    getAvailableNodesFromSchema(schema) {
        return schema.elements.filter(element => element.data.label !== undefined).map(element => {
            return { id: element.data.id, label: element.data.label }
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

    toggleModal() {
        this.setState({
            modalOpen: (!this.state.modalOpen)
        })
    }

    render() {
        if (this.props.metapath && this.props.metapath.length > 0) {
            const metapathEntities = this.props.metapath.filter(element => element.data('label') !== undefined).map(element => element.data('label'));
            const metapathEntityBoxes = [];
            metapathEntities.forEach(element => {
                if (metapathEntityBoxes.length > 0) {
                    metapathEntityBoxes.push(<EntityConnector />);
                }
                metapathEntityBoxes.push(
                    <EntityBox className='' color="dark" disabled label={element} />
                );
            });
            return (
                <Row>
                    {metapathEntityBoxes}
                    <MetapathControl schema={this.props.schema} metapath={this.props.metapath} onNewEntity={this.props.onNewEntity} onDelete={this.props.onDelete} />
                </Row>
            );
        } else if (this.nodes) {
            return (
                <div>
                    <Button outline color="dark" size="lg" onClick={this.toggleModal.bind(this)}>Select starting entity</Button>
                    {(this.state.modalOpen) &&
                        <EntityInsertionModal entities={this.nodes} onSelection={this.props.onNewEntity} onDismiss={this.toggleModal.bind(this)} />}
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

export default MetapathPanel;