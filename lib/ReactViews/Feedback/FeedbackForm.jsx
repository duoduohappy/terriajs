'use strict';

import ObserveModelMixin from '../ObserveModelMixin';
import React from 'react';
import sendFeedback from '../../Models/sendFeedback.js';

const FeedbackForm = React.createClass({
    mixins: [ObserveModelMixin],

    propTypes: {
        viewState: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            isSending: false,
            name: '',
            email: '',
            comment: ''
        };
    },

    onDismiss() {
        this.props.viewState.feedbackFormIsVisible = false;
    },

    onSubmit(evt) {
        evt.preventDefault();

        if (this.state.comment.length > 0) {
            this.setState({
                isSending: true
            });

            // submit form
            sendFeedback({
                terria: this.props.viewState.terria,
                name: this.state.name,
                email: this.state.email,
                comment: this.state.comment
            }).then(succeeded => {
                if (succeeded) {
                    this.setState({
                        isSending: false,
                        comment: ''
                    });
                    this.props.viewState.feedbackFormIsVisible = false;
                } else {
                    this.setState({
                        isSending: false
                    });
                }
            });
        }

        return false;
    },

    handleChange(e) {
        this.setState({
            [e.target.getAttribute('name')]: e.target.value
        });
    },

    render() {
        return (
            <div className='feedback__inner'>
                <div className={`feedback--form ${this.props.viewState.feedbackFormIsVisible ? 'is-open' : ''}`}>
                    <div className='form__header'>
                        <h4 className='form--title'>Feedback</h4>
                        <button className='btn btn--close' onClick ={this.onDismiss} title='close feedback'></button>
                    </div>
                    <form onSubmit={this.onSubmit}>
                      <div className="form--description">We would love to hear from you!</div>
                      <label>Your name (optional)</label>
                      <input type="text" name="name" className="field" value={this.state.name} onChange={this.handleChange}/>
                      <label>Email address (optional)<br/><em>We can't follow up without it!</em></label>
                      <input type="text" name="email" className="field" value={this.state.email} onChange={this.handleChange}/>
                      <label>Comment or question</label>
                      <textarea className="field" name="comment" value={this.state.comment} onChange={this.handleChange}/>
                      <div className='form__action'>
                        <button type="button" className="btn btn-cancel" onClick ={this.onDismiss}>Cancel</button>
                        <button type="submit" className="btn btn-submit" disabled={this.state.isSending}>{this.state.isSending ? 'Sending...' : 'Send'}</button>
                      </div>
                    </form>
            </div>
          </div>
        );
    }
});

module.exports = FeedbackForm;