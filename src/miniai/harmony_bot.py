from base_bot import BaseBot

class HarmonyBot(BaseBot):
    """A Mini-AI bot that responds to harmony events and mediates between bots."""
    def receive(self, message):
        if message.get('type') == 'harmony':
            self.state['harmony_level'] = self.state.get('harmony_level', 0) + message.get('intensity', 1)
    def act(self):
        if self.state.get('harmony_level', 0) > 3:
            print(f"{self.name} is radiating harmony!")
            self.state['harmony_level'] = 0
