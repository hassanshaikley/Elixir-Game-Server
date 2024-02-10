defmodule UdpServer do
  # Our module is going to use the DSL (Domain Specific Language) for Gen(eric) Servers
  use GenServer
  alias Phoenix.PubSub

  # We need a factory method to create our server process
  # it takes a single parameter `port` which defaults to `2052`
  # This runs in the caller's context
  def start_link(port \\ 5355) do
    # Start 'er up
    GenServer.start_link(__MODULE__, port)
  end

  # Initialization that runs in the server context (inside the server process right after it boots)
  def init(port) do
    # Use erlang's `gen_udp` module to open a socket
    # With options:
    #   - binary: request that data be returned as a `String`
    #   - active: gen_udp will handle data reception, and send us a message `{:udp, socket, address, port, data}` when new data arrives on the socket
    # Returns: {:ok, socket}
    {:ok, socket} = :gen_udp.open(port, [:binary, active: true])

    PubSub.subscribe(:my_pubsub, "user:123")

    {:ok, %{socket: socket}}
  end

  def handle_info(message, state) when is_binary(message) do
    :gen_udp.send(state.socket, state.address, state.port, message)

    {:noreply, state}
  end

  # define a callback handler for when gen_udp sends us a UDP packet
  def handle_info({:udp, _socket, address, port, data}, state) do
    # punt the data to a new function that will do pattern matching

    :gen_udp.send(state.socket, address, port, "hello wello") |> IO.inspect(label: :sending)
    IO.puts("Broadcasting")
    PubSub.broadcast(:my_pubsub, "user:123", "Hell you said something")

    state
    |> Map.put(:address, address)
    |> Map.put(:port, port)
    |> handle_packet(data)
    |> IO.inspect(label: :setting_state)
  end

  ### ALERT: you may not want to support the quit message in a production UDP server ###
  # pattern match the "quit" message
  defp handle_packet(state, "quit\n") do
    IO.puts("Received: quit. Closing down...")

    # close the socket
    :gen_udp.close(state.socket)

    # GenServer will understand this to mean we want to stop the server
    # action: :stop
    # reason: :normal
    # new_state: nil, it doesn't matter since we're shutting down :(
    {:stop, :normal, nil}
  end

  # fallback pattern match to handle all other (non-"quit") messages
  defp handle_packet(state, data) do
    # print the message
    IO.puts("Received: #{String.trim(data)}")

    :gen_udp.send(state.socket, state.address, state.port, "hello 2")
    |> IO.inspect(label: :sending)

    {:noreply, state}
  end
end
