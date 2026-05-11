# Python WebSocket client for Mini-AI engine
import websocket
import threading
import json

class MiniAIWebSocketClient:
    def __init__(self, url, bots):
        self.url = url
        self.bots = bots
        self.ws = websocket.WebSocketApp(url,
            on_message=self.on_message,
            on_open=self.on_open)
    def on_message(self, ws, message):
        data = json.loads(message)
        for bot in self.bots:
            bot.receive(data)
            bot.act()
    def on_open(self, ws):
        print('Connected to WebSocket bridge')
    def run(self):
        thread = threading.Thread(target=self.ws.run_forever)
        thread.daemon = True
        thread.start()
