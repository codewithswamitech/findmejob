import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";

export const mswServer = setupServer();

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
