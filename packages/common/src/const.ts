export const DefaultTemplate = `using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "{{id}}", worker = .worker{{id}}),
  ],

  sockets = [
    (
      name = "{{id}}",
      address = "{{hostName}}:{{port}}",
      http = (),
      service = "{{id}}"
    ),
  ]
);

const worker{{id}} :Workerd.Worker = (
  serviceWorkerScript = embed "src/{{entry}}",
  compatibilityDate = "2024-06-03",
);
`;
