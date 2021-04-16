import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export interface IAutocompleteInputProps extends StateProps, DispatchProps {
    id: string,

    placeholder: string,

    size?: string,
    value?: string,
    disabled: boolean,
    onChange: any,
};

export class AutocompleteInput extends React.Component<IAutocompleteInputProps> {

    ref = null;
    index = 0;

    readonly state: any = {
        menuOpen: false,
        blurValue: '',
        isLoading: false,
        options: [],
        current: ''
    };
    _typeahead: any;

    onSearch(query) {
        
        axios.get(`api/datasets/autocomplete`, {
            params: {
              term: query
            }
        }).then( response => {
            this.setState({
                isLoading: false,
                options: response.data,
            });
        });
    }

    validateCurrentValue() {
        const currentFieldValueLC = this.state.current.toLowerCase();
        if (currentFieldValueLC) {
            const foundOption = this.state.options.find(option => option.name.toLowerCase()===currentFieldValueLC);
            return (foundOption!==undefined)?foundOption:false;
        }
    }

    clearField() {
        if ((this.ref) && (this.ref.current)) {
            this.ref.current.getInstance().clear();
        }
    }

    onMenuToggle(isOpen) {
        this.setState({
            menuOpen: isOpen
        });
    }
    clear() {
        const instance = this._typeahead.getInstance();
        instance.clear();
        instance.focus();
    }
    onChange(e) {
        this.props.onChange(e);
        this._typeahead.getInstance().clear();
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
                defaultInputValue={this.props.value || ''}
                ref={(ref) => this._typeahead = ref}
            />
		);
	}
};


const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutocompleteInput);



