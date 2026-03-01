import Draggable from "./components/Draggable";
import Triangle from "./components/Triangle";
import MainWindow from "./components/windows/MainWindow";
import WatcherWindow from "./components/windows/WatcherWindow";
import { wrap } from "./nine";

MainWindow().mount("body");
WatcherWindow().mount("body");

Draggable({ x: wrap(100), y: wrap(100) }, {
    content: () => Triangle()
}).mount("body");
