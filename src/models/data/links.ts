import { type LinkProps } from '@/typings/link';
import { uuid } from '@/utils/common';
import type RowItem from './row';

export class LinkItem {
  originLink: LinkProps;
  fromRow: RowItem;
  toRow: RowItem;
  uuid: string;
  color: string;

  constructor(link: LinkProps, from: RowItem, to: RowItem) {
    this.uuid = uuid();

    this.originLink = link;
    this.fromRow = from;
    this.toRow = to;
    this.color = link?.color ?? '#eca710';
  }
}

export default class AllLinks {
  /**
   * 原始数据集合（全部）
   */
  originLinks: LinkProps[] = [];

  /**
   * 内部使用代理数据（只有展示的）
   */
  links: LinkItem[] = [];

  /**
   * 初始化数据
   * @param data 展示的数据集合
   */
  init(data: RowItem[], links: LinkProps[]) {
    this.originLinks = links;
    this.links = this.createLinks(data, links);
  }

  /**
   * 创建连线数据
   */
  createLinks(data: RowItem[], links: LinkProps[]) {
    return links
      .map(link => {
        const from = data.find(d => d.id === link.from);
        const to = data.find(d => d.id === link.to);
        if (from && to) {
          return new LinkItem(link, from, to);
        } else {
          return null;
        }
      })
      .filter(link => link !== null) as LinkItem[];
  }

  /**
   * 更新连线
   * @param data 展示的数据集合
   * @param links 新数据（原始）。如果不传，则使用原始数据更新当前已有
   */
  update(data: RowItem[], links?: LinkProps[]) {
    // this.__diff(this.data, data, options);
    // this.__flatten();
  }

  /**
   * 添加一条连线
   */
  addLink(from: RowItem, to: RowItem) {
    const link = {
      from: from.id,
      to: to.id
    };
    this.originLinks.push(link);
    this.links.push(new LinkItem(link, from, to));

    return link;
  }
}
