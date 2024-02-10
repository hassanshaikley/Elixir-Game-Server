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

    {:ok, %{socket: socket}}
  end

  # define a callback handler for when gen_udp sends us a UDP packet
  def handle_info({:udp, _socket, address, port, data}, state) do
    # punt the data to a new function that will do pattern matching

    :gen_udp.send(state.socket, address, port, %{some: "data"}) |> IO.inspect(label: :sending)

    socket_id = generate_socket_id()

    PubSub.subscribe(:my_pubsub, "user:#{socket_id}")

    state
    |> Map.put(:address, address)
    |> Map.put(:port, port)
    |> Map.put(:socket_id, socket_id)
    |> handle_packet(data)
  end

  def handle_info(message, state) do
    :gen_udp.send(state.socket, state.address, state.port, message)

    {:noreply, state}
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

    :gen_udp.send(state.socket, state.address, state.port, Jason.encode!(%{hello: "world"}))

    {:noreply, state}
  end

  defp generate_socket_id do
    to_string(:erlang.ref_to_list(:erlang.make_ref())) |> String.slice(5..-2//1)
  end
end
