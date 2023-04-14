type Style = Record<string, string>;

export default class StyleBox {
  private border: number = 1;
  private borderColor: string = '#e5e5e5';

  setBorder(b: number) {
    this.border = b;
  }

  getBorder(): Style {
    return { border: `${this.border}px solid` };
  }

  setBorderColor(bc: string) {
    this.borderColor = bc;
  }

  getBorderColor(): Style {
    return { 'border-color': this.borderColor };
  }
}
