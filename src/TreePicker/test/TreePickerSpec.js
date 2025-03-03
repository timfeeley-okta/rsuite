import React from 'react';
import { act, Simulate } from 'react-dom/test-utils';
import { getDOMNode, getInstance, render } from '@test/testUtils';
import TreePicker from '../TreePicker';
import { KEY_VALUES } from '../../utils';

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

describe('TreePicker', () => {
  it('Should render default value', () => {
    const instance = getDOMNode(<TreePicker defaultOpen data={data} defaultValue={'Master'} />);

    expect(instance.querySelector('.rs-picker-toggle-value').innerText).to.equal('Master');
  });

  it('Should clean selected value', () => {
    const instance = getDOMNode(<TreePicker defaultOpen data={data} defaultValue={'Master'} />);

    Simulate.click(instance.querySelector('.rs-picker-toggle-clean'));
    expect(instance.querySelector('.rs-picker-toggle').innerText).to.equal('Select');
  });

  it('Should output a clean button', () => {
    const instance = getDOMNode(<TreePicker defaultOpen data={data} defaultValue={'Master'} />);
    assert.ok(instance.querySelector('.rs-picker-toggle-clean'));
  });

  it('Should render TreePicker Menu', () => {
    const instance = getInstance(<TreePicker defaultOpen data={data} />);
    expect(instance.overlay.classList.contains('.rs-picker-tree-menu'));
  });

  it('Should output a button', () => {
    const instance = getDOMNode(<TreePicker toggleAs="button" data={[]} />);

    assert.ok(instance.querySelector('button'));
  });

  it('Should be disabled', () => {
    const instance = getDOMNode(<TreePicker disabled data={[]} />);

    assert.include(instance.className, 'disabled');
  });

  it('Should be block', () => {
    const instance = getDOMNode(<TreePicker block data={[]} />);

    assert.include(instance.className, 'block');
  });

  it('Should active one node by `value`', () => {
    const instance = getInstance(<TreePicker data={data} value={'Master'} open />);
    assert.equal(instance.overlay.querySelectorAll('.rs-tree-node-active').length, 1);
  });

  it('Should expand children nodes', () => {
    const instance = getInstance(
      <TreePicker open cascade={false} data={data} value={['Master']} />
    );

    Simulate.click(
      instance.overlay.querySelector('div[data-ref="0-0"]  > .rs-tree-node-expand-icon')
    );
    assert.equal(instance.overlay.querySelectorAll('.rs-tree-open').length, 1);
  });

  it('Should have a placeholder', () => {
    const instance = getDOMNode(<TreePicker data={data} placeholder="test" />);

    assert.equal(instance.querySelector('.rs-picker-toggle-placeholder').innerText, 'test');
  });

  it('Should render value by `renderValue()`', () => {
    const placeholder = 'value';

    // valid value
    const instance1 = getDOMNode(
      <TreePicker
        data={[
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ]}
        value={'2'}
        renderValue={(value, item) => `Selected: ${item.label}`}
      />
    );

    // invalid value
    const instance2 = getDOMNode(
      <TreePicker
        data={[
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ]}
        value={'5'}
        renderValue={v => [v, placeholder]}
      />
    );

    // invalid value
    const instance3 = getDOMNode(
      <TreePicker
        placeholder={placeholder}
        data={[]}
        value={null}
        renderValue={v => [v, placeholder]}
      />
    );

    assert.equal(instance1.querySelector('.rs-picker-toggle-value').innerText, 'Selected: 2');
    assert.equal(instance2.querySelector('.rs-picker-toggle-value').innerText, `5${placeholder}`);
    assert.equal(instance3.querySelector('.rs-picker-toggle-placeholder').innerText, placeholder);
  });

  it('Should call renderValue', () => {
    const instance1 = getDOMNode(<TreePicker value="Test" renderValue={() => '1'} />);
    const instance2 = getDOMNode(<TreePicker value="Test" renderValue={() => null} />);
    const instance3 = getDOMNode(<TreePicker value="Test" renderValue={() => undefined} />);

    assert.equal(instance1.querySelector('.rs-picker-toggle-value').innerText, '1');
    assert.equal(instance2.querySelector('.rs-picker-toggle-placeholder').innerText, 'Select');
    assert.equal(instance3.querySelector('.rs-picker-toggle-placeholder').innerText, 'Select');
  });

  it('Should not be call renderValue()', () => {
    const instance = getDOMNode(<TreePicker data={[]} renderValue={() => 'value'} />);
    assert.equal(instance.querySelector('.rs-picker-toggle-placeholder').innerText, 'Select');
  });

  it('Should render a placeholder when value error', () => {
    const instance = getDOMNode(<TreePicker placeholder="test" data={data} value={['4']} />);

    assert.equal(instance.querySelector('.rs-picker-toggle-placeholder').innerText, 'test');
  });

  it('Should call `onChange` callback', () => {
    const onChangeSpy = sinon.spy();
    const instance = getInstance(<TreePicker open onChange={onChangeSpy} data={data} />);

    Simulate.click(instance.overlay.querySelector('span[data-key="0-0"]'));
    assert.isTrue(onChangeSpy.calledOnce);
  });

  it('Should call `onClean` callback', () => {
    const onCleanSpy = sinon.spy();
    const instance = getDOMNode(
      <TreePicker defaultOpen data={data} defaultValue={'tester0'} onClean={onCleanSpy} />
    );

    Simulate.click(instance.querySelector('.rs-picker-toggle-clean'));
    assert.isTrue(onCleanSpy.calledOnce);
  });

  it('Should call `onOpen` callback', () => {
    const onOpenSpy = sinon.spy();
    const instance = getDOMNode(<TreePicker onOpen={onOpenSpy} data={data} />);

    Simulate.click(instance.querySelector('.rs-picker-toggle'));
    assert.isTrue(onOpenSpy.calledOnce);
  });

  it('Should call `onClose` callback', () => {
    const onCloseSpy = sinon.spy();
    const instance = getDOMNode(<TreePicker onClose={onCloseSpy} data={data} />);

    Simulate.click(instance.querySelector('.rs-picker-toggle'));
    Simulate.click(instance.querySelector('.rs-picker-toggle'));
    assert.isTrue(onCloseSpy.calledOnce);
  });

  it('Should focus item by keyCode=40', () => {
    const instance = getInstance(<TreePicker open data={data} defaultExpandAll value="tester1" />);
    Simulate.keyDown(instance.target, { key: KEY_VALUES.DOWN });

    assert.equal(instance.overlay.querySelector('.rs-tree-node-focus').innerText, 'Master');
  });

  it('Should focus item by keyCode=38 ', () => {
    const instance = getInstance(<TreePicker open data={data} defaultExpandAll value="tester1" />);

    Simulate.click(instance.overlay.querySelector('span[data-key="0-0-1"]'));
    Simulate.keyDown(instance.target, { key: KEY_VALUES.UP });
    assert.equal(instance.overlay.querySelector('.rs-tree-node-focus').innerText, 'tester0');
  });

  it('Should focus item by keyCode=13 ', done => {
    const doneOp = () => {
      done();
    };
    const instance = getInstance(
      <TreePicker defaultOpen data={data} onChange={doneOp} defaultExpandAll />
    );
    Simulate.click(instance.overlay.querySelector('span[data-key="0-0-1"]'));
  });

  /**
   * When focus is on an open node, closes the node.
   */
  it('Should fold children node by keyCode=37', () => {
    const tree = getInstance(<TreePicker defaultOpen data={data} defaultExpandAll />);

    Simulate.click(tree.overlay.querySelector('span[data-key="0-0"]'));
    Simulate.keyDown(tree.overlay, { key: KEY_VALUES.LEFT });
    assert.equal(
      tree.overlay.querySelectorAll('div[data-ref="0-0"] > .rs-tree-node-expanded').length,
      0
    );
  });

  /**
   * When focus is on a root node that is also either an end node or a closed node, does nothing.
   */
  it('Should change nothing when trigger on root node by keyCode=37', () => {
    const tree = getInstance(<TreePicker defaultOpen data={data} defaultExpandAll />);

    Simulate.click(tree.overlay.querySelector('span[data-key="0-0"]'));
    Simulate.keyDown(tree.overlay, { key: KEY_VALUES.LEFT });
    assert.equal(tree.overlay.querySelector('.rs-tree-node-focus').innerText, 'Master');

    assert.equal(
      tree.overlay.querySelectorAll('div[data-ref="0-0"] > .rs-tree-node-expanded').length,
      0
    );
  });

  /**
   * When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
   */
  it('Should focus on parentNode when trigger on leaf node by keyCode=37', () => {
    const tree = getInstance(<TreePicker defaultOpen data={data} defaultExpandAll />);

    Simulate.click(tree.overlay.querySelector('span[data-key="0-0"]'));
    Simulate.keyDown(tree.overlay, { key: KEY_VALUES.LEFT });
    assert.equal(tree.overlay.querySelector('.rs-tree-node-focus').innerText, 'Master');
  });

  /**
   * When focus is on a closed node, opens the node; focus does not move.
   */
  it('Should fold children node by keyCode=39', () => {
    const tree = getInstance(<TreePicker defaultOpen data={data} />);

    Simulate.click(tree.overlay.querySelector('span[data-key="0-0"]'));
    Simulate.keyDown(tree.overlay, { key: KEY_VALUES.RIGHT });
    assert.equal(
      tree.overlay.querySelectorAll('div[data-ref="0-0"] > .rs-tree-node-expanded').length,
      1
    );
  });

  /**
   * When focus is on an end node, does nothing.
   */
  it('Should change nothing when trigger on leaf node by keyCode=39', () => {
    const tree = getInstance(<TreePicker defaultOpen data={data} defaultExpandAll />);

    Simulate.click(tree.overlay.querySelector('span[data-key="0-0-0"]'));
    Simulate.keyDown(tree.overlay, { key: KEY_VALUES.RIGHT });
    assert.equal(tree.overlay.querySelector('.rs-tree-node-focus').innerText, 'tester0');
  });

  /**
   * When focus is on a open node, moves focus to the first child node.
   */
  it('Should focus on first child node when node expanded by keyCode=39', () => {
    const tree = getInstance(<TreePicker defaultOpen data={data} defaultExpandAll />);

    Simulate.click(tree.overlay.querySelector('span[data-key="0-0"]'));
    Simulate.keyDown(tree.overlay, { key: KEY_VALUES.RIGHT });
    assert.equal(tree.overlay.querySelector('.rs-tree-node-focus').innerText, 'tester0');
  });

  it('Should have a custom className', () => {
    const instance = getDOMNode(<TreePicker className="custom" data={data} />);
    assert.include(instance.className, 'custom');
  });

  it('Should have a custom style', () => {
    const fontSize = '12px';
    const instance = getDOMNode(<TreePicker style={{ fontSize }} data={data} />);
    assert.equal(instance.style.fontSize, fontSize);
  });

  it('Should have a custom menuStyle', () => {
    const fontSize = '12px';
    const instance = getInstance(<TreePicker open menuStyle={{ fontSize }} data={data} />);
    assert.equal(getDOMNode(instance.overlay).style.fontSize, fontSize);
  });

  it('Should load data async', () => {
    const data = [
      {
        label: 'Master',
        value: 'Master'
      },
      {
        label: 'async',
        value: 'async',
        children: []
      }
    ];
    const ref = React.createRef();
    act(() => {
      render(
        <TreePicker
          data={data}
          cascade={false}
          open
          ref={ref}
          defaultExpandAll
          getChildren={() => [
            {
              label: 'children1',
              value: 'children1'
            }
          ]}
        />
      );
    });

    act(() => {
      Simulate.click(
        ref.current.overlay.querySelector('div[data-ref="0-1"]  > .rs-tree-node-expand-icon')
      );
    });

    assert.ok(ref.current.overlay.querySelector('[data-key="0-1-0"]'));
  });

  it('Should render one node when searchKeyword is `M`', () => {
    const instance = getInstance(<TreePicker data={data} open searchKeyword="M" />);

    assert.equal(instance.overlay.querySelectorAll('.rs-tree-node').length, 1);
  });

  it('Should have a custom className prefix', () => {
    const instance = getDOMNode(<TreePicker data={data} classPrefix="custom-prefix" />);
    assert.ok(instance.className.match(/\bcustom-prefix\b/));
  });

  it('Should render tree node with custom dom', () => {
    const customData = [
      {
        value: '1',
        label: <span className="custom-label">1</span>
      }
    ];
    const instance = getInstance(<TreePicker data={customData} open />);
    assert.equal(instance.overlay.querySelectorAll('.custom-label').length, 1);
  });

  it('Should call `onOpen` callback', done => {
    const doneOp = () => {
      done();
    };
    const picker = getInstance(<TreePicker onOpen={doneOp} data={data} />);
    picker.open();
  });

  it('Should call `onClose` callback', done => {
    const doneOp = () => {
      done();
    };
    const picker = getInstance(<TreePicker defaultOpen onClose={doneOp} data={data} />);
    picker.close();
  });

  it('Should render with expand master node', () => {
    const instance = getInstance(
      <TreePicker defaultOpen data={data} expandItemValues={['Master']} />
    );
    assert.equal(getDOMNode(instance.overlay).querySelectorAll('.rs-tree-node-expanded').length, 1);
  });

  it('Should fold all the node when toggle master node', () => {
    const TestApp = React.forwardRef((props, ref) => {
      const pickerRef = React.useRef();
      const [expandItemValues, setExpandItemValues] = React.useState(['Master']);
      React.useImperativeHandle(ref, () => {
        return {
          picker: pickerRef.current,
          setExpandItemValues
        };
      });
      return (
        <TreePicker
          ref={pickerRef}
          {...props}
          data={data}
          open
          expandItemValues={expandItemValues}
        />
      );
    });

    TestApp.displayName = 'TestApp';

    let expandItemValues = [];
    const mockOnExpand = values => {
      expandItemValues = values;
    };
    const ref = React.createRef();
    act(() => {
      render(<TestApp ref={ref} onExpand={mockOnExpand} />);
    });

    assert.ok(ref.current.picker.overlay.querySelector('.rs-tree-node-expanded'));

    act(() => {
      Simulate.click(
        ref.current.picker.overlay.querySelector('div[data-ref="0-0"]  > .rs-tree-node-expand-icon')
      );
    });

    act(() => {
      ref.current.setExpandItemValues(expandItemValues);
    });

    assert.ok(!ref.current.picker.overlay.querySelector('.rs-tree-node-expanded'));
  });

  it('Should render the specified menu content by `searchBy`', () => {
    const instance = getInstance(
      <TreePicker
        defaultOpen
        defaultExpandAll
        data={data}
        searchBy={(a, b, c) => c.value === 'Master'}
      />
    );
    const list = getDOMNode(instance.overlay).querySelectorAll('.rs-tree-node');
    assert.equal(list.length, 1);
    assert.ok(list[0].innerText, 'Louisa');
  });

  it('Should only clean the searchKeyword', () => {
    const instance = getInstance(
      <TreePicker defaultOpen defaultExpandAll data={data} defaultValue={'Master'} />
    );

    const searchBar = instance.overlay.querySelector('.rs-picker-search-bar-input');
    Simulate.change(searchBar, {
      target: { value: 'Master' }
    });

    searchBar.focus();
    Simulate.keyDown(searchBar, {
      key: KEY_VALUES.BACKSPACE
    });
    assert.equal(instance.root.querySelector('.rs-picker-toggle-value').innerText, 'Master');

    Simulate.keyDown(instance.overlay, {
      key: KEY_VALUES.BACKSPACE
    });

    assert.ok(!instance.root.querySelector('.rs-picker-toggle-value .rs-picker-value-item'));
  });

  it('Should display the search result when in virtualized mode', () => {
    const instance = getInstance(<TreePicker open virtualized data={data} />);

    assert.equal(instance.overlay.querySelectorAll('.rs-tree-node').length, 2);

    const searchBar = instance.overlay.querySelector('.rs-picker-search-bar-input');
    Simulate.change(searchBar, {
      target: { value: 'test' }
    });

    assert.equal(instance.overlay.querySelectorAll('.rs-tree-node').length, 4);
  });

  it('Should to reset the option height', () => {
    const instance = getInstance(
      <TreePicker open virtualized data={data} listProps={{ rowHeight: 28 }} />
    );

    const node = instance.overlay.querySelector('.rs-tree-node');
    assert.equal(node.style.height, '28px');
  });
});
