class MessageBus:
    """Simple in-memory message bus for Mini-AI bots."""
    def __init__(self):
        self.subscribers = []
    def subscribe(self, bot):
        self.subscribers.append(bot)
    def publish(self, message):
        for bot in self.subscribers:
            bot.receive(message)
