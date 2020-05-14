/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
}))

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.loadQuizzesStudio = this.loadQuizzesStudio.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkInputChange = this.checkInputChange.bind(this)
  }

  componentDidMount() {
    const { plugin, fieldValue } = this.props
    this.loadQuizzesStudio();
    this.intervalID = setInterval(this.checkInputChange, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  checkInputChange() {
    const { plugin, fieldValue } = this.props
    const embededInput = document.getElementsByClassName('wirisembeddedstudioinput')[0]
    if(!embededInput) return
    const { value } = embededInput
    // value will inlcude <question> when it is set from the studio pop
    if(!value || !value.includes('<question>')) return
    if (value === fieldValue) return this.loadQuizzesStudio()
    plugin.setFieldValue(plugin.fieldPath, value)
  }

  loadQuizzesStudio() {
    const { fieldValue } = this.props
    const builder = com.wiris.quizzes.api.QuizzesBuilder.getInstance();
    const uibuilder = builder.getQuizzesUIBuilder();
    // Build teacher's answer field. The parameters of this function allow for
    // more precise customization of the grading criteria and are adressed at higher
    // levels of this Getting Started guide.
    let questionObject = null
    if (fieldValue) questionObject = builder.readQuestion(fieldValue)
    const authoringField = uibuilder.newAuthoringField(questionObject, null, 0);
    authoringField.setFieldType(
      com.wiris.quizzes.api.ui.QuizzesUIConstants.STUDIO
    );
    authoringField.showVariablesTab(true)
    authoringField.showGradingFunction(true)
    const authoringContainer = document.getElementById("studiowrapper");
    authoringContainer.replaceChild(
      authoringField.getElement(),
      authoringContainer.firstChild
    );
  }

  handleInputChange (evt) {
    const { plugin } = this.props
    plugin.setFieldValue(plugin.fieldPath, evt.target.value)
  }

  render() {
    const { fieldValue } = this.props
    return (
      <div className="container">
        <textarea
          className='configtextarea'
          value={fieldValue}
          onChange={this.handleInputChange}
          rows={6}
        />
        <div id='studiowrapper'><span></span></div>
      </div>
    );
  }
}
