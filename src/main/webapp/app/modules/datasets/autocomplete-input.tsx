import './upload.scss';

import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import  _  from 'lodash';
import { __metadata } from 'tslib';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export interface IAutocompleteInputProps extends StateProps, DispatchProps {
    id: string,
    placeholder: string, 

    entity: string, 
    field: string, 
    folder: string, 
    size?: string,
    value?: string,

    disabled: boolean, 
    onChange: any,

};

export class AutocompleteInput extends React.Component<IAutocompleteInputProps> {
	readonly state:any = {
        isLoading: false,
        options: [],
    };

    onSearch(query) {
        this.setState({ isLoading: true }, () => {
            axios.get(`api/datasets/autocomplete`, {
                params: {
                    entity: this.props.entity,
                    field: this.props.field,
                    folder: this.props.folder,
                    term: query
                }
            }).then( (response) => {
                this.setState({
                    isLoading: false,
                    options: response.data,
                });
            });
        });
    }
    onChange(e) {
        this.props.onChange(e);
    }
	render() {

        return (
			<AsyncTypeahead
                allowNew={false}
                isLoading={this.state.isLoading}
                multiple={false}
                options={this.state.options}
                id={this.props.id}
                labelKey="name"
                minLength={1}
                onSearch={this.onSearch.bind(this)}
                onChange={this.onChange.bind(this)}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
                bsSize={this.props.size}
                defaultInputValue={this.props.value || ''}
            />
		);
	}
};

const mapStateToProps = (storeState: IRootState) => ({  
});

const mapDispatchToProps = { 
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AutocompleteInput);



