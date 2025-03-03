import React from 'react';
import TreePicker from '../index';
import { render, getStyle, inChrome } from '@test/testUtils';

import '../styles/index.less';

const data = [
  {
    label: 'Master',
    value: 'Master',
    children: [
      {
        label: 'tester0',
        value: 'tester0'
      },
      {
        label: 'tester1',
        value: 'tester1',
        children: [
          {
            label: 'tester2',
            value: 'tester2'
          }
        ]
      }
    ]
  },
  {
    label: 'Disabled node',
    value: 'disabled'
  }
];

describe('TreePicker styles', () => {
  it('Should render the correct styles', () => {
    const instanceRef = React.createRef();
    render(<TreePicker data={data} ref={instanceRef} open />);
    const pickerMenuDom = document.querySelector('.rs-picker-tree-menu');
    const treeWrapperDom = pickerMenuDom.querySelector('.rs-tree');
    const treeNodeDom = pickerMenuDom.querySelector('.rs-tree-node');
    inChrome &&
      assert.equal(
        getStyle(treeWrapperDom, 'padding'),
        '0px 12px 12px 0px',
        'Picker tree wrapper padding'
      );
    assert.equal(getStyle(treeNodeDom, 'fontSize'), '0px', 'Picker tree node font-size');
    assert.equal(getStyle(treeNodeDom, 'height'), '36px', 'Picker tree node height');
  });
});
