import { ErrorType } from "../event";
import { ILink } from "./link";

export interface EventMap {
  loaded: () => void;
  error: (error: ErrorType) => void;
  "update:link": (link: ILink) => void;
  "create:link": (link: ILink) => void;
  "select:link": (
    add: ILink | null,
    cancel: ILink | null,
    all: ILink[]
  ) => void;
  select: (data: any[], checked: boolean, all: any[]) => void;
  "click:row": (e: MouseEvent, data: any) => void;
  "dblclick:row": (e: MouseEvent, data: any) => void;
  "contextmenu:row": (e: MouseEvent, data: any) => void;
  "click:slider": (e: MouseEvent, data: any) => void;
  "dblclick:slider": (e: MouseEvent, data: any) => void;
  "contextmenu:slider": (e: MouseEvent, data: any) => void;
  move: (data: { row: any; old: any }[]) => void;
}
