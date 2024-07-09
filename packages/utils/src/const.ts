export const DefaultTemplate = `using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "{{UID}}", worker = .{{UID}}Worker),
  ],

  sockets = [
    (
      name = "{{UID}}",
      address = "{{HostName}}:{{Port}}",
      http = (),
      service = "{{UID}}"
    ),
  ]
);

const {{UID}}Worker :Workerd.Worker = (
  serviceWorkerScript = embed "src/{{Entry}}",
  compatibilityDate = "2024-06-03",
);
`;