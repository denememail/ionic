import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State } from '@stencil/core';

import { Color, Mode, TabbarClickDetail, TabbarLayout } from '../../interface';
import { createColorClasses } from '../../utils/theme';
import { TabbarChangedDetail } from '../tab-bar/tab-bar-interface';

@Component({
  tag: 'ion-tab-button',
  styleUrls: {
    ios: 'tab-button.ios.scss',
    md: 'tab-button.md.scss'
  },
  shadow: true
})
export class TabButton implements ComponentInterface {

  private tabGroup?: HTMLIonTabGroupElement;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'document' }) doc!: Document;

  /**
   * The selected tab component
   */
  @State() selected = false;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Set the layout of the text and icon in the tabbar.
   */
  @Prop({ mutable: true }) layout?: TabbarLayout;

  /**
   * The URL which will be used as the `href` within this tab's button anchor.
   */
  @Prop() href?: string;

  /**
   * The tab view's id
   */
  @Prop() viewId?: string;

  /**
   * The selected tab component
   */
  @Prop() disabled = false;

  /**
   * Emitted when the tab bar is clicked
   */
  @Event() ionTabbarClick!: EventEmitter<TabbarClickDetail>;

  @Listen('parent:ionTabbarChanged')
  onTabbarChanged(ev: CustomEvent<TabbarChangedDetail>) {
    this.selected = this.viewId === ev.detail.viewId;
  }

  @Listen('click')
  onClick(ev: Event) {
    if (!this.disabled) {
      this.ionTabbarClick.emit({
        viewId: this.viewId,
        href: this.href
      });
    }
    ev.preventDefault();
  }

  componentWillLoad() {
    this.tabGroup = this.el.closest('ion-tab-group') || undefined;
    if (!this.tabGroup) {
      console.error('ion-tab-bar should be a direct children of ion-tab-group');
    }
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  hostData() {
    const { color, selected, layout, disabled, hasLabel, hasIcon } = this;
    return {
      'ion-activatable': true,
      'aria-selected': selected ? 'true' : null,
      'role': 'tab',
      class: {
        ...createColorClasses(color),

        'tab-btn': true,
        'tab-btn-selected': selected,
        'tab-btn-has-label': hasLabel,
        'tab-btn-has-icon': hasIcon,
        'tab-btn-has-label-only': hasLabel && !hasIcon,
        'tab-btn-has-icon-only': hasIcon && !hasLabel,
        'tab-btn-disabled': disabled,
        [`layout-${layout}`]: true,
      }
    };
  }

  render() {
    const { mode, href } = this;
    return (
      <a href={href || '#'}>
        <slot></slot>
        {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </a>
    );
  }
}
