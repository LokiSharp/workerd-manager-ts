import { generateWorkerConfig, generateWorkerConfigCapfile } from "@/workerd/workerd-conf-generator";
import { Worker } from '@/gen/wokerd_pb';

describe("test generateWorkerConfig function", () => {
    it("should return generated Worker Config", () => {
        const configData = new Worker({
            id: "a5eb7b7d602449f699cb7bda44fde846",
            externalPath: "test",
            hostName: "example.com",
            nodeName: "test",
            port: 8080,
            entry: "entry.js",
            code: "",
            name: "test",
        });

        const config = generateWorkerConfig(configData);
        expect(config).toEqual(`using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "a5eb7b7d602449f699cb7bda44fde846", worker = .workera5eb7b7d602449f699cb7bda44fde846),
  ],

  sockets = [
    (
      name = "a5eb7b7d602449f699cb7bda44fde846",
      address = "example.com:8080",
      http = (),
      service = "a5eb7b7d602449f699cb7bda44fde846"
    ),
  ]
);

const workera5eb7b7d602449f699cb7bda44fde846 :Workerd.Worker = (
  serviceWorkerScript = embed "src/entry.js",
  compatibilityDate = "2024-06-03",
);
`);
    });
});

describe("test generateWorkerConfigCapfile function", () => {
    test("should return Error if worker is invalid", () => {
        const worker = new Worker();
        const result = generateWorkerConfigCapfile(worker);
        expect(result).toEqual(new Error('Invalid worker'));
    });
});
