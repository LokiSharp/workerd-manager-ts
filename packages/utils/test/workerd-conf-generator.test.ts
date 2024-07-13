import { generateWorkerConfig, generateWorkerConfigCapfile } from "@/workerd-conf-generator";
import { Worker } from '@/gen/wokerd_pb';

describe("test generateWorkerConfig function", () => {
    it("should return generated Worker Config", () => {
        const configData = new Worker({
            UID: "a5eb7b7d602449f699cb7bda44fde846",
            ExternalPath: "test",
            HostName: "example.com",
            NodeName: "test",
            Port: 8080,
            Entry: "entry.js",
            Code: new Uint8Array(0),
            Name: "test",
        });

        const config = generateWorkerConfig(configData);
        expect(config).toEqual(`using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "a5eb7b7d602449f699cb7bda44fde846", worker = .a5eb7b7d602449f699cb7bda44fde846Worker),
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

const a5eb7b7d602449f699cb7bda44fde846Worker :Workerd.Worker = (
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
