import {
    handleBodyRequestParsing,
    handleCompression
  } from "./common";
  
  import { handleAPIDocs } from "./api_docs";
  import { handleCSMUI} from "./static_ui";
  
  export default [
    handleBodyRequestParsing,
    handleCompression,
    handleAPIDocs,
    handleCSMUI
  ];