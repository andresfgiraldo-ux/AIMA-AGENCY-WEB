#!/bin/bash

echo "🚀 Content Creator Agent - Setup"
echo "=================================="
echo ""

# Crear directorios
mkdir -p data logs agents

echo "✅ Directories created"
echo ""

# Verificar Higgsfield CLI
if ! command -v higgsfield &> /dev/null; then
    echo "⚠️  Higgsfield CLI not found"
    echo "Install with: npm install -g @higgsfield/cli"
else
    echo "✅ Higgsfield CLI found: $(higgsfield --version)"
fi

echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js first."
    exit 1
else
    echo "✅ Node.js: $(node --version)"
fi

echo ""

# Test agente
echo "🧪 Testing Content Creator Agent..."
if node agents/content-creator.js --marca aima-agency > /tmp/test-output.log 2>&1; then
    echo "✅ Agent works!"
    echo ""
    head -20 /tmp/test-output.log
else
    echo "❌ Error running agent"
    cat /tmp/test-output.log
    exit 1
fi

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Authenticate Higgsfield: higgsfield auth login"
echo "2. Configure Instagram tokens in data/marcas.json"
echo "3. Run daily: /loop 24h node agents/content-creator.js"
echo ""
echo "📖 Read CONTENT_CREATOR_GUIDE.md for more info"
