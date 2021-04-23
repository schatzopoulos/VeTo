import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Container, Input, Progress, Row } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { getJob, getMoreResults, getResults, getStatus } from './jobs.reducer';
import ResultsPanel from './results/results';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface IHomeProps extends StateProps, DispatchProps {
    loading: boolean;
    progress: number;
    progressMsg: string;
    error: string;
    docs: any;
    meta: any;
    uuid: string;
};

export class Jobs extends React.Component<IHomeProps> {
    readonly state: any = {
        jobId: ''
    };
    polling: any;

    pollForResults() {
        this.polling = setInterval(() => {
            this.props.getStatus(this.props.uuid);
        }, 1000);
    }

    componentDidMount() {
        if (this.props['match']['params']['jobId']) {
            this.setState({
                jobId: this.props['match']['params']['jobId']
            }, () => {
                this.props.getJob(this.state.jobId);
            });
        }
    }

    componentDidUpdate(prevProps) {

        // new uuid detected, start polling
        if (this.props.loading && !prevProps.loading) {
            this.pollForResults();
        } else if (prevProps.loading && !this.props.loading) {
            clearInterval(this.polling);
        }

        if (prevProps.loading && !this.props.loading) {

            this.props.getResults(this.props.uuid);
        }
    }

    componentWillUnmount() {
        clearInterval(this.polling);
    }

    execute(e) {
        e.preventDefault();
        this.props.getJob(this.state.jobId);
    }

    loadMoreResults(nextPage) {
        this.props.getMoreResults(this.props.uuid, nextPage);
    }

    onChangeInput(e) {
        const jobId = e.target.value;
        this.setState({
            jobId
        });
    }

    getDescriptionString() {
        if (this.props.analysesParameters) {
            const metapath = this.props.analysesParameters.metapath;
            const analyses = this.props.analysesParameters.analyses.join(', ');
            const constraints = this.props.analysesParameters.constraintsExpression;

            let statusString = '';
            switch (this.props.analysesParameters.status) {
                case 'PENDING':
                    statusString = 'Executing';
                    break;
                case 'COMPLETE':
                    statusString = 'Completed';
                    break;
                default:
                    statusString = 'Unknown state when';
            }

            return `${statusString} ${analyses} for metapath ${metapath} and constraint(s): ${constraints}.`;
        } else {
            return '';
        }
    }

    render() {

        return (
            <Container fluid>
                <Row>
                    <Col md="6">
                        <Row>
                            <Col>
                               <h4>Re-attach to analysis</h4>
                                <Row>
                                    <Col md='10'>
                                        <Input name="job_id" id="job_id" placeholder="Please give a valid analysis id"
                                               onChange={this.onChangeInput.bind(this)} value={this.state.jobId} />
                                    </Col>
                                    <Col md='2'>
                                        <Button color="success" disabled={this.props.loading || this.state.jobId === ''}
                                                onClick={this.execute.bind(this)}>
                                            Search
                                        </Button>
                                    </Col>
                                    &nbsp;

                                </Row>
                            </Col>
                        </Row>

                    </Col>
                    <Col md='12'>
                        <Row>
                            <Col md='12'>
                                <Container>
                                    {this.props.uuid &&
                                    <div className={'my-4 pt-0'}>

                                        {this.props.error &&
                                        <Row>
                                            <Col xs={'12'} className={'text-danger'}>{this.props.error}</Col>
                                        </Row>
                                        }
                                        {
                                            (this.props.loading) && <Progress animated color="info"
                                                                            value={this.props.progress}>{this.props.progressMsg}</Progress>
                                        }
                                        {

                                        (!_.isEmpty(this.props.results)) && 
                                            <div>
                                                <ResultsPanel
                                                    uuid={this.props.uuid}
                                                    results={this.props.results}
                                                    loadMore={this.loadMoreResults.bind(this)}
                                                />
                                            </div>
                                        }
                                    </div>
                                    }

                                </Container>
                            </Col>
                        </Row>
                </Col>
                </Row>
            </Container>
        );
    }
};

const mapStateToProps = (storeState: IRootState) => ({
    loading: storeState.jobs.loading,
    progress: storeState.jobs.progress,
    progressMsg: storeState.jobs.progressMsg,
    description: storeState.jobs.description,
    analysesParameters: storeState.jobs.analysesParameters,
    error: storeState.jobs.error,
    results: storeState.jobs.results,
    status: storeState.jobs.status,
    uuid: storeState.jobs.uuid,
    analysis: storeState.jobs.analysis
});

const mapDispatchToProps = {
    getJob,
    getStatus,
    getResults,
    getMoreResults
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Jobs);



