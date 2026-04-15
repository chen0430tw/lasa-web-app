import { createLASAServer } from "./api";

const api = createLASAServer(3000);
api.listen();
