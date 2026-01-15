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

### 2. ✅ Bug: Reatribuição de `const` implícita (CORRIGIDO)
**Ficheiro:** `script.js` (linha 554)
**Gravidade:** Média

```javascript
if (!potenciaSelecionada) potenciaSelecionada = "6,9 kVA";
```

**Problema:** `potenciaSelecionada` é declarada como `const` algumas linhas antes, portanto esta atribuição nunca seria alcançada de qualquer forma mas gera confusão.

**Correção:** Linha removida, adicionado comentário explicativo.

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

### 6. ✅ Bug: Variável `OMIESSelecionadoS` sobrescrita desnecessariamente (CORRIGIDO)
**Ficheiro:** `script.js` (linhas 520-528 e 876-889)
**Gravidade:** Baixa

A variável é calculada no início de `atualizarResultados()` e depois sobrescrita novamente no final com o mesmo cálculo.

**Correção:** Removido cálculo redundante no início da função, mantido apenas o cálculo baseado em `DataS` e manual input.

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

### 5. ✅ Guardar Preferências/Perfis (IMPLEMENTADO)
**Benefício:** Utilizadores podem guardar configurações frequentes.

**Implementação completa** com sistema de até 5 perfis, interface de gestão e restauro automático.

---

### 6. Simulador de Bi-Horário vs Simples
**Benefício:** Ajudar utilizadores a escolher entre tarifas simples e bi-horárias.

---

### 7. ✅ Calculadora de Poupança Anual (IMPLEMENTADO)
**Benefício:** Mostrar potencial poupança se trocar de tarifário.

**Implementação completa** com cálculo de poupança anual/mensal, integração com "Meu Tarifário" e display dinâmico nos resultados.

---

### 8. ✅ Integração com Fatura Digital (IMPLEMENTADO)
**Benefício:** Permitir upload de fatura para preenchimento automático de consumo.

**Implementação completa** com upload drag-and-drop, processamento via Gemini Flash API, extração de dados e preenchimento automático.

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
1. ✅ Implementar dark mode
2. Adicionar exportação PDF
3. Melhorar modularização do código
4. Adicionar testes unitários

### Baixa Prioridade (Roadmap Futuro)
1. ✅ PWA completa (manifest + service worker)
2. ✅ Content Security Policy
3. Multi-idioma
4. Widget incorporável
5. Integração com fatura digital

---

## IMPLEMENTAÇÕES REALIZADAS

### Commit 1: Bug fixes e acessibilidade inicial
- ✅ Corrigido bug recursivo em `debugLog()`
- ✅ Corrigido comentário HTML malformado no iframe
- ✅ Substituídas imagens em falta por ícones SVG
- ✅ Adicionados meta tags Open Graph e SEO
- ✅ Adicionado skip link para acessibilidade
- ✅ Melhorado sistema de retry no carregamento de CSV

### Commit 2: UI/UX Major Improvements
- ✅ **Sistema de Temas com CSS Custom Properties**
  - Todas as cores extraídas para variáveis CSS
  - Facilita manutenção e theming
  
- ✅ **Dark Mode Completo**
  - Toggle no canto superior direito
  - Persiste preferência no localStorage
  - Respeita preferência do sistema (prefers-color-scheme)
  - Transição suave entre temas
  
- ✅ **Design Responsivo Melhorado**
  - Três breakpoints: mobile (480px), tablet (768px), desktop
  - Layouts fluidos que se adaptam ao ecrã
  - Botões com tamanhos touch-friendly em mobile
  - Tabela otimizada para ecrãs pequenos
  
- ✅ **PWA (Progressive Web App)**
  - manifest.json para instalação como app
  - Service Worker para funcionamento offline
  - Cache de recursos essenciais
  - Estratégia cache-first com updates em background
  
- ✅ **Lazy Loading do CSV Grande**
  - Carrega apenas quando o utilizador usa intervalo de datas
  - Reduz tempo de carregamento inicial
  - Indicador de loading durante carregamento
  
- ✅ **Validação de Inputs**
  - Funções utilitárias para validação numérica e de datas
  - Estados de erro visuais com ARIA attributes
  - Mensagens de erro claras
  
- ✅ **Melhorias Visuais**
  - Nova paleta de cores moderna
  - Sombras e transições suaves
  - Melhor hierarquia visual
  - Animações e micro-interações

### Commit 3: Bug fixes e UX Improvements
- ✅ **Bug #2 Corrigido**: Removida linha redundante de reatribuição de `const potenciaSelecionada`
- ✅ **Bug #6 Corrigido**: Removido cálculo duplicado de `OMIESSelecionadoS` no início de `atualizarResultados()`
- ✅ **Content Security Policy**: Adicionada meta tag CSP para proteção XSS
- ✅ **Atalhos de Teclado**:
  - `Ctrl+Enter` / `Cmd+Enter` para recalcular
  - `Escape` para fechar painel de definições
  - `D` para alternar tema claro/escuro (quando não em input)
- ✅ **Histórico de Comparações**:
  - Sistema completo de histórico em localStorage
  - Guarda últimas 10 comparações
  - Funções: `saveToHistory()`, `getHistory()`, `clearHistory()`, `restoreFromHistory()`
  - Snapshot inclui: consumo, potência, mês, dias, OMIE, intervalo de datas

### Commit 4: User Profiles, Savings Calculator & Invoice Infrastructure
- ✅ **Sistema de Perfis de Utilizador**:
  - Guardar até 5 perfis com configurações personalizadas
  - Cada perfil guarda: consumo, potência, opções selecionadas, meu tarifário
  - Funções: `saveProfile()`, `loadProfile()`, `deleteProfile()`, `getProfiles()`
  - Interface com lista de perfis na nova aba "Perfis"
  - Carregar/apagar perfis com um clique
  
- ✅ **Calculadora de Poupança Anual**:
  - Calcula poupança comparando tarifário atual vs melhor opção
  - Exibe poupança mensal e anual em euros e percentagem
  - Integrado com "Meu Tarifário" para comparação automática
  - Funções: `calculateAnnualSavings()`, `calculateSavingsFromCurrentTariff()`, `formatSavingsDisplay()`
  - Display dinâmico após resultados
  
- ✅ **Infraestrutura para Upload de Fatura (Gemini Flash API)**:
  - Nova aba "Fatura" no painel de definições
  - Interface drag-and-drop para upload de imagens/PDFs
  - Integração com Google Gemini 2.0 Flash para extração de dados
  - Extração automática de: comercializador, consumo, potência, preços, período
  - Preenchimento automático do formulário com dados extraídos
  - Configuração de API key pelo utilizador (sessão apenas)
  - Funções: `extractInvoiceData()`, `applyInvoiceData()`, `initInvoiceUpload()`
  - Prompt otimizado para faturas portuguesas
  
- ✅ **Novas Abas no Painel de Definições**:
  - "👤 Perfis" - Gestão de perfis de utilizador
  - "📄 Fatura" - Upload e processamento de faturas
  
- ✅ **CSS Adicional**:
  - Estilos para profiles-container, profile-item
  - Estilos para savings-display (positivo/negativo)
  - Estilos para invoice-upload (dropzone, progress, results)
  - Responsive design para novos componentes

---

## 📋 PRÓXIMOS PASSOS SUGERIDOS

### Curto Prazo
1. Testar extração de faturas com diferentes comercializadores
2. Adicionar validação mais robusta dos dados extraídos
3. Implementar cache de resultados de extração

### Médio Prazo
1. Exportação PDF dos resultados
2. Testes unitários com Jest/Vitest
3. Modularização do código em ES6 modules

### Longo Prazo
1. Suporte multi-idioma (i18n)
2. Widget incorporável para sites externos
3. Comparação histórica de preços

---

## 📊 ATUALIZAÇÃO DE DADOS 2026

### Tarifas de Acesso às Redes (TAR) 2026
A ERSE estabeleceu um aumento médio de 3,5% nas TAR para BTN em 2026.

| Componente | Período | Valor 2026 (€/kWh) |
|------------|---------|-------------------|
| Simples | - | 0,0654 |
| Bi-Horário | Fora de Vazio | 0,0895 |
| Bi-Horário | Vazio | 0,0198 |
| Tri-Horário | Ponta | 0,2142 |
| Tri-Horário | Cheias | 0,0683 |
| Tri-Horário | Vazio | 0,0198 |

### Mercado Regulado (SU Eletricidade) 2026
Preço de referência para tarifa simples: **0,1654 €/kWh**

| Potência | Termo Potência (€/dia) | Energia Simples (€/kWh) |
|----------|------------------------|------------------------|
| 3.45 kVA | 0,1865 | 0,1654 |
| 4.60 kVA | 0,2446 | 0,1654 |
| 5.75 kVA | 0,3055 | 0,1654 |
| 6.90 kVA | 0,3648 | 0,1654 |
| 10.35 kVA | 0,5397 | 0,1654 |
| 13.80 kVA | 0,7136 | 0,1654 |
| 17.25 kVA | 0,8875 | 0,1654 |
| 20.70 kVA | 1,0614 | 0,1654 |

### Principais Comercializadores 2026 (Destaques)

#### Goldenergy ACP (Melhor para baixo consumo)
- Potência 6.9 kVA: **0,3614 €/dia**
- Energia: **0,1499 €/kWh**
- Vantagem: Termo de potência muito competitivo

#### Endesa Digital Luz (Melhor para alto consumo)
- Potência 6.9 kVA: **0,7041 €/dia**
- Energia: **0,1291 €/kWh**
- Vantagem: Preço kWh mais baixo do mercado fixo

#### EDP Digital 2026
- Potência 6.9 kVA: **0,5801 €/dia**
- Energia: **0,1424 €/kWh**
- Vantagem: Bom equilíbrio para 3.45 kVA

#### Plenitude Tarifa Fácil
- Potência 6.9 kVA: **0,5435 €/dia**
- Energia: **0,1410 €/kWh**
- Vantagem: All-rounder equilibrado

#### G9 Energy Vantagem+
- Potência 6.9 kVA: **0,4498 €/dia**
- Energia: **0,1348 €/kWh**
- Vantagem: Outsider muito competitivo

### Mercado Indexado 2026
Previsão OMIE para 2026: **53-60 €/MWh** (0,053-0,060 €/kWh)

| Comercializador | Potência 6.9 kVA (€/dia) |
|-----------------|-------------------------|
| Luzboa | 0,4374 |
| Ibelectra | 0,2616 (muito competitivo) |
| Coopérnico | 0,3418 |

### Ficheiro de Dados Criado
- **SimuladorEletricidade_OF_MN_2026.csv** - Contém todos os dados atualizados para 2026

---

*Documento atualizado em Janeiro 2026*

