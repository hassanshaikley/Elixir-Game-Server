defmodule TutorialBackendTest do
  use ExUnit.Case
  doctest TutorialBackend

  test "greets the world" do
    assert TutorialBackend.hello() == :world
  end
end
