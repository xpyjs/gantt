import { ErrorType } from "../event";
import { ILink } from "./link";

export interface EventMap {
  loaded: () => void;
  error: (error: ErrorType, msg?: string) => void;
  "update:link": (link: ILink) => void;
  "create:link": (link: ILink) => void;
  "select:link": (
    add: ILink | null,
    cancel: ILink | null,
    all: ILink[]
  ) => void;
  "contextmenu:link": (e: MouseEvent, link: ILink) => void;
  select: (data: any[], checked: boolean, all: any[]) => void;
  "click:row": (e: MouseEvent, data: any) => void;
  "dblclick:row": (e: MouseEvent, data: any) => void;
  "contextmenu:row": (e: MouseEvent, data: any) => void;
  "click:slider": (e: MouseEvent, data: any) => void;
  "dblclick:slider": (e: MouseEvent, data: any) => void;
  "contextmenu:slider": (e: MouseEvent, data: any) => void;
  move: (data: { row: any; old: any }[]) => void;
  "hover:slider": (e: MouseEvent, data: any) => void;
  "leave:slider": (e: MouseEvent, data: any) => void;
  "click:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  "contextmenu:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  "hover:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  "leave:baseline": (e: MouseEvent, data: any, baseline: any) => void;
}
