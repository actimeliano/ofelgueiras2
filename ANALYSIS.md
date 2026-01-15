# Análise do Comparador de Tarifários - Bugs, Melhorias e Funcionalidades

## Resumo Executivo

Este documento apresenta uma análise detalhada do projeto "Comparador de Tarifários", identificando bugs, oportunidades de melhoria técnica e sugestões de novas funcionalidades para melhorar a experiência do utilizador.

---

## 🐛 BUGS IDENTIFICADOS

### 1. Bug Crítico: Função `debugLog` recursiva infinita
**Ficheiro:** `script.js` (linhas 21-25)
**Gravidade:** Alta

```javascript
function debugLog(...args) {
    if (DEBUG_MODE) {
        debugLog(...args);  // ❌ Chama a si mesma recursivamente!
    }
}
```

**Problema:** A função `debugLog` chama-se a si própria em vez de `console.log`, causando stack overflow quando `DEBUG_MODE = true`.

**Correção:**
```javascript
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);  // ✅ Correto
    }
}
```

---

### 2. Bug: Reatribuição de `const` implícita
**Ficheiro:** `script.js` (linha 554)
**Gravidade:** Média

```javascript
if (!potenciaSelecionada) potenciaSelecionada = "6,9 kVA";
```

**Problema:** `potenciaSelecionada` é declarada como `const` algumas linhas antes, portanto esta atribuição nunca seria alcançada de qualquer forma mas gera confusão.

---

### 3. Bug: Imagem YouTube com extensão incorreta
**Ficheiro:** `index.html` (linha 481)

```html
<img src="YouTube_full-color_icon.png" alt="YouTube" ...>
```

**Problema:** O ficheiro `YouTube_full-color_icon.png` não existe no repositório, causando imagem quebrada.

---

### 4. Bug: Imagem X (Twitter) com ficheiro inexistente
**Ficheiro:** `index.html` (linha 487)

```html
<img src="X_icon_2.svg" alt="X (Twitter)" ...>
```

**Problema:** O ficheiro `X_icon_2.svg` não existe no repositório.

---

### 5. Bug: Comentário HTML malformado dentro de atributo
**Ficheiro:** `index.html` (linhas 457-461)

```html
<iframe
  ...
  <!-- loading="lazy"-->  <!-- ❌ Comentário inválido dentro da tag -->
  style="border:none; ..."
></iframe>
```

**Problema:** Comentário HTML dentro de uma tag causa comportamento imprevisível.

---

### 6. Bug: Variável `OMIESSelecionadoS` sobrescrita desnecessariamente
**Ficheiro:** `script.js` (linhas 520-528 e 876-889)
**Gravidade:** Baixa

A variável é calculada no início de `atualizarResultados()` e depois sobrescrita novamente no final com o mesmo cálculo.

---

## ⚡ MELHORIAS TÉCNICAS

### 1. Performance: Carregar CSV grande de forma assíncrona
**Estado atual:** O CSV grande é carregado após 1 segundo de delay.

**Sugestão:** Usar `Intersection Observer` ou lazy loading baseado em necessidade real.

```javascript
// Carregar apenas quando o utilizador interage com funcionalidades que precisam
function carregarCSVGrandeSeNecessario() {
    if (!dadosCSV_grande.length && DataS) {
        return carregarCSV(urlCSV_grande);
    }
}
```

---

### 2. Código: Extrair constantes de cores para variáveis CSS
**Estado atual:** Muitas cores hardcoded no JavaScript.

**Sugestão:** Usar CSS custom properties para todas as cores.

```css
:root {
    --cor-header-primaria: #77D99A;
    --cor-header-secundaria: #375623;
    --cor-consumo: #FFC000;
    /* ... */
}
```

---

### 3. Segurança: Adicionar Content Security Policy
**Ficheiro:** `index.html`

**Sugestão:** Adicionar meta tag CSP para proteger contra XSS.

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' unpkg.com www.googletagmanager.com; style-src 'self' 'unsafe-inline' unpkg.com;">
```

---

### 4. Acessibilidade: Melhorar suporte a leitores de ecrã
**Problemas identificados:**
- Botões sem labels adequados
- Tabela de resultados sem `aria-label`
- Falta de `role` em elementos interativos

**Sugestão:**
```html
<table role="table" aria-label="Comparação de tarifários de eletricidade">
    <caption class="visually-hidden">Lista de tarifários ordenados por preço</caption>
</table>
```

---

### 5. SEO: Adicionar meta tags Open Graph
**Ficheiro:** `index.html`

```html
<meta property="og:title" content="Comparador de Tarifários de Eletricidade">
<meta property="og:description" content="Compare tarifários de eletricidade em Portugal">
<meta property="og:image" content="android-chrome-512x512.png">
<meta property="og:type" content="website">
```

---

### 6. Cache: Implementar Service Worker para funcionamento offline
**Benefício:** Permitir utilização offline com dados em cache.

---

### 7. Modularização: Separar código em módulos ES6
**Estado atual:** Todo o código está num único ficheiro de ~2700 linhas.

**Sugestão:** Separar em módulos:
- `utils.js` - Funções utilitárias
- `data.js` - Carregamento e processamento de dados
- `ui.js` - Manipulação de interface
- `calculations.js` - Cálculos de tarifários

---

### 8. Tratamento de Erros: Melhorar feedback ao utilizador
**Estado atual:** Erros de carregamento mostram apenas mensagem genérica.

**Sugestão:** Adicionar retry automático e mensagens mais específicas.

```javascript
async function carregarCSVComRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await carregarCSV(url);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
        }
    }
}
```

---

### 9. Validação: Implementar validação de inputs mais robusta
**Estado atual:** Validação básica com `parseFloat`.

**Sugestão:** Usar schema validation ou class validators.

---

### 10. Testes: Adicionar testes unitários
**Sugestão:** Implementar testes com Jest ou Vitest.

```javascript
describe('formatDecimal', () => {
    test('formata número com vírgula', () => {
        expect(formatDecimal(1.5, 2)).toBe('1,50');
    });
});
```

---

## 🚀 NOVAS FUNCIONALIDADES SUGERIDAS

### 1. Modo Escuro (Dark Mode)
**Benefício:** Melhor experiência em ambientes com pouca luz.

**Implementação:**
```javascript
// Toggle dark mode
document.getElementById('btnDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
```

---

### 2. Exportar Resultados para PDF/Excel
**Benefício:** Permitir guardar comparações para referência futura.

```javascript
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // ... gerar PDF com resultados
}
```

---

### 3. Comparação Histórica de Preços
**Benefício:** Ver evolução dos tarifários ao longo do tempo.

**Implementação:** Adicionar gráfico de linha mostrando variação de preços.

---

### 4. Notificações de Alterações de Preços
**Benefício:** Alertar utilizadores quando tarifários mais baratos ficam disponíveis.

**Implementação:** Web Push Notifications com Service Worker.

---

### 5. Guardar Preferências/Perfis
**Benefício:** Utilizadores podem guardar configurações frequentes.

```javascript
function guardarPerfil(nome) {
    const perfil = {
        potencia: document.getElementById('potenciac').value,
        consumo: document.getElementById('consumoInput').value,
        // ...
    };
    localStorage.setItem(`perfil_${nome}`, JSON.stringify(perfil));
}
```

---

### 6. Simulador de Bi-Horário vs Simples
**Benefício:** Ajudar utilizadores a escolher entre tarifas simples e bi-horárias.

---

### 7. Calculadora de Poupança Anual
**Benefício:** Mostrar potencial poupança se trocar de tarifário.

```javascript
function calcularPoupancaAnual(tarifaAtual, tarifaNova, consumoMensal) {
    const custoAtual = tarifaAtual.custo * 12;
    const custoNovo = tarifaNova.custo * 12;
    return custoAtual - custoNovo;
}
```

---

### 8. Integração com Fatura Digital
**Benefício:** Permitir upload de fatura para preenchimento automático de consumo.

---

### 9. Widget para Sites Externos
**Benefício:** Permitir incorporação do comparador em outros sites.

```html
<iframe src="https://ofelgueiras2.github.io/comparador-widget"></iframe>
```

---

### 10. Versão PWA (Progressive Web App)
**Benefício:** Instalação como app no telemóvel.

**Ficheiros necessários:**
- `manifest.json`
- `service-worker.js`

---

### 11. Filtros Avançados de Tarifários
**Benefício:** Filtrar por comercializador, tipo de contrato, etc.

```html
<select id="filtroComercializador">
    <option value="">Todos</option>
    <option value="EDP">EDP</option>
    <option value="Galp">Galp</option>
    <!-- ... -->
</select>
```

---

### 12. Gráfico de Composição da Fatura
**Benefício:** Visualizar quanto cada componente contribui para o total.

---

### 13. Comparação Multi-Período
**Benefício:** Comparar custos para diferentes meses simultaneamente.

---

### 14. Alertas de Promoções
**Benefício:** Mostrar tarifários com promoções ativas em destaque.

---

### 15. Suporte Multi-Idioma (i18n)
**Benefício:** Disponibilizar em inglês para estrangeiros em Portugal.

```javascript
const i18n = {
    'pt': { consumo: 'Consumo (kWh)', potencia: 'Potência (kVA)' },
    'en': { consumo: 'Consumption (kWh)', potencia: 'Power (kVA)' }
};
```

---

## 📋 MELHORIAS DE UX

### 1. Feedback Visual em Ações
- Adicionar animações de loading durante cálculos
- Highlight de valores alterados

### 2. Onboarding para Novos Utilizadores
- Tutorial interativo na primeira visita
- Tooltips explicativos expandidos

### 3. Responsividade Melhorada
- Otimizar layout para tablets
- Melhorar touch targets em mobile

### 4. Atalhos de Teclado
- `Ctrl+Enter` para recalcular
- `Tab` navigation otimizado

### 5. Histórico de Comparações
- Manter últimas N comparações em localStorage

---

## 🔧 MELHORIAS DE INFRAESTRUTURA

### 1. Automatizar Atualização de Dados
- GitHub Action para verificar novos dados ERSE diariamente
- Notificar quando há atualizações de tarifários

### 2. Monitorização de Erros
- Integrar Sentry ou similar para tracking de erros em produção

### 3. Analytics Melhorados
- Eventos custom no GA4 para tracking de interações específicas

### 4. CDN para Assets Estáticos
- Usar CDN para melhorar tempo de carregamento global

---

## PRIORIZAÇÃO RECOMENDADA

### Alta Prioridade (Fazer Agora)
1. ✅ Corrigir bug `debugLog` recursivo
2. ✅ Adicionar imagens em falta (YouTube, X)
3. ✅ Corrigir comentário HTML malformado
4. ✅ Melhorar acessibilidade básica

### Média Prioridade (Próximas Iterações)
1. Implementar dark mode
2. Adicionar exportação PDF
3. Melhorar modularização do código
4. Adicionar testes unitários

### Baixa Prioridade (Roadmap Futuro)
1. PWA completa
2. Multi-idioma
3. Widget incorporável
4. Integração com fatura digital

---

*Documento gerado em Janeiro 2026*
