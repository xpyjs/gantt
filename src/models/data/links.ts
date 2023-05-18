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
    this.init(data, links ?? this.originLinks);
  }

  /**
   * 创建一条连线
   */
  createLink(from: RowItem, to: RowItem): LinkProps | null {
    if (
      from.uuid === to.uuid ||
      this.links.some(
        link => link.fromRow.uuid === from.uuid && link.toRow.uuid === to.uuid
      )
    ) {
      return null;
    }

    const link = {
      from: from.id,
      to: to.id
    };
    return link;
  }

  /**
   * 添加一条连线
   */
  addLink(link: LinkProps, from: RowItem, to: RowItem) {
    if (!link.from || !link.to) return;
    if (this.originLinks.some(l => l.from === link.from && l.to === link.to))
      return;

    this.originLinks.push(link);
    this.links.push(new LinkItem(link, from, to));
  }

  /**
   * 更新一条连线
   */
  updateLink(link: LinkProps) {
    if (!link.from || !link.to) return;

    const index = this.originLinks.findIndex(
      l => l.from === link.from && l.to === link.to
    );

    if (index > -1) {
      this.originLinks.splice(index, 1, link);

      const linkIndex = this.links.findIndex(
        l => l.fromRow.id === link.from && l.toRow.id === link.to
      );

      if (linkIndex > -1) {
        this.links.splice(
          linkIndex,
          1,
          new LinkItem(
            link,
            this.links[linkIndex].fromRow,
            this.links[linkIndex].toRow
          )
        );
      }
    }
  }
}
