class BaseBot:
    """
    Z-Sanctuary Mini-AI base bot class.
    Handles basic lifecycle, messaging, and state.
    """
    def __init__(self, name):
        self.name = name
        self.state = {}

    def receive(self, message):
        """Process incoming message."""
        pass

    def act(self):
        """Perform bot action."""
        pass

    def report(self):
        """Return current state."""
        return self.state
