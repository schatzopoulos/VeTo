import React from 'react';
import RecommendationEntityBox from './recommendation-entity-box';
import EntityConnector from 'app/modules/metapath/entity-connector';

interface RecommendationProps {
  recommendationEntities: any,
  idIndexedSchema: any,
  onRecommendationAccept: any
}

class Recommendation extends React.Component<RecommendationProps> {
  readonly state: any = {
    focused: false
  }

  focus(e) {
    this.setState({
      focused:true
    });
  }

  unfocus(e) {
    this.setState({
      focused:false
    });
  }

  submitRecommendation() {
    this.props.onRecommendationAccept(this.props.recommendationEntities);
  }

  render(){
    const recommendationEntityBoxes=this.props.recommendationEntities.map((entity, index)=><RecommendationEntityBox
      key={`${this.props.idIndexedSchema[entity]}-${index}`} entity={this.props.idIndexedSchema[entity]}
      emphasize={this.state.focused}
      onMouseEnter={this.focus.bind(this)}
      onMouseOut={this.unfocus.bind(this)}
      onClick={this.submitRecommendation.bind(this)}
    />);
    const itemsToBeRendered = [];
    recommendationEntityBoxes.forEach((entityBox, index)=> {
      if (index !== 0) {
        itemsToBeRendered.push(<EntityConnector recommendation={true} emphasize={this.state.focused} />);
      }
      itemsToBeRendered.push(entityBox);
    });
    return (
      <div className={'d-flex px-1'}>
        {itemsToBeRendered}
      </div>
    );
  }
}

export default Recommendation;
