import {
    handleBodyRequestParsing,
    handleCompression
  } from "./common";
  
  import { handleAPIDocs } from "./apiDocs";
  import { handleCSMUI} from "./staticUI";
  
  export default [
    handleBodyRequestParsing,
    handleCompression,
    handleAPIDocs,
    handleCSMUI
  ];