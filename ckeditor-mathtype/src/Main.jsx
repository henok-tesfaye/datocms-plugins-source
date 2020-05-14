/* eslint-disable */
import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '../ckeditor5/build/ckeditor';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
}))

export default class Main extends Component {
  render() {
    const { plugin, fieldValue } = this.props
    return (
      <CKEditor
        editor={ClassicEditor}
        data={fieldValue}
        onInit={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          plugin.setFieldValue(plugin.fieldPath, data)
        }}
      />
    );
  }
}
