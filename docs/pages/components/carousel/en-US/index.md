# Carousel

Display a set of elements in a carousel

## Import

<!--{include:(components/carousel/fragments/import.md)}-->

## Examples

### Default

<!--{include:`basic.md`}-->

### Appearance

<!--{include:`appearance.md`}-->

### Autoplay

<!--{include:`autoplay.md`}-->

## Props

### `<Carousel>`

| Property         | Type `(Default)`                                       | Description                                    |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------- |
| as               | ElementType `('div')`                                  | Custom element type                            |
| autoplay         | boolean                                                | Automatic carousel element.                    |
| autoplayInterval | number (`4000`)                                        | Delay in ms until navigating to the next item. |
| children         | ReactNode                                              | Carousel elements                              |
| classPrefix      | string `('carousel')`                                  | Component CSS class prefix                     |
| onSelect         | (index: number, event?: React.ChangeEvent) => void     | Callback fired when the active item changes    |
| onSlideEnd       | (index: number, event?: React.TransitionEvent) => void | Callback fired when a slide transition ends    |
| onSlideStart     | (index: number, event?: React.ChangeEvent) => void     | Callback fired when a slide transition starts  |
| placement        | enum:'top','bottom','left','right' `('bottom')`        | Button placement                               |
| shape            | enum:'dot','bar' `('dot')`                             | Button shape                                   |
