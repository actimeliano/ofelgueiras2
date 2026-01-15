// ============================================================
// CONFIGURATION
// ============================================================

// Debug mode - set to false in production to disable debugLog
const DEBUG_MODE = false;

// Dynamic year configuration
const CURRENT_YEAR = new Date().getFullYear();
const DATA_YEAR = CURRENT_YEAR; // Year for date constraints

// Date range configuration
const DATE_MIN = `${DATA_YEAR}-01-01`;
const DATE_MAX = `${DATA_YEAR}-12-31`;

// Data freshness tracking
let dataLastUpdated = null;
let dataLoadError = null;

// Debug logging utility
function debugLog(...args) {
    if (DEBUG_MODE) {
        debugLog(...args);
    }
}

// ============================================================
// CSV PATHS AND DATA
// ============================================================

// ✅ NOVO: caminhos para os dois ficheiros separados
const urlCSV_basico = "gs/Simulador_basico.csv";
const urlCSV_grande = "gs/Simulador_grande.csv";

let dadosCSV_basico = [];
let dadosCSV_grande = [];

// ✅ NOVO: estrutura adaptada às novas localizações
const tabelasBasicas = {
    Meses: { inicio: "AB6", fim: "AB24" },
    Perdas: { inicio: "AC6", fim: "AC24" },
    OMIE: { inicio: "AD6", fim: "AD24" },
    descSocial: { inicio: "AQ12", fim: "AQ15" },
    Indexados: { inicio: "AS3", fim: "AS9" },
    diasMeses: { inicio: "AT14", fim: "AT32" },
    indexBase: { inicio: "AT3", fim: "AT9" },
    strDias: { inicio: "AU14", fim: "AU32" },
    Ciclos: { inicio: "AV5", fim: "BC1" },
    intDatas: { inicio: "BE2", fim: "BE368" },
    empresasBiHorario: { inicio: "C41", fim: "C61" },
    empresasSimples: { inicio: "C5", fim: "C25" },
    preçosSimples: { inicio: "D5", fim: "W25" },
    preçosBiHorario: { inicio: "D41", fim: "AG61" },
    tabelasKVA: { inicio: "D2", fim: "W2" },
    tabelasKVABi: { inicio: "D38", fim: "AG38" },
    kVAsExtraTarSocial: { inicio: "U30", fim: "U32" },
    kVAsTarSocial: { inicio: "U30", fim: "U35" },
    descKVAsExtraTarSocial: { inicio: "V30", fim: "V32" },
    descKVAsTarSocial: { inicio: "V30", fim: "V35" },
    kVAs: { inicio: "Y6", fim: "Y15" },
    LuzigazFee: { inicio: "Z27", fim: "Z36" },
    TARPotencias: { inicio: "Z6", fim: "Z15" },
    detalheTarifarios: { inicio: "AM5", fim: "AM25" },
    tarifariosExtra: { inicio: "C68", fim: "C79" },
    detalheTarifariosExtra: { inicio: "B68", fim: "B79" },
    preçosSimplesExtra: { inicio: "D68", fim: "W79" },
};

const tabelasGrandes = {
    TData: { inicio: "A2", fim: "A35041" },
    TBTN_A: { inicio: "E2", fim: "E35041" },
    TBTN_B: { inicio: "F2", fim: "F35041" },
    TBTN_C: { inicio: "G2", fim: "G35041" },
    TPreco: { inicio: "H2", fim: "H35041" },
    TBD: { inicio: "B2", fim: "B35041" },
    TBS: { inicio: "B2", fim: "H35041" },
    TPT: { inicio: "D2", fim: "D35041" }
};

let adiarGrandes = false;

const variaveis = {
    perdas2024: "AC18",
    aano: "AP5",
    adata: "AP4",
    diasAno: "AP6",
    pdata: "AQ5",
    pdatam7: "AQ6",
    Medio: "AT26",
    luzboaCGS: "H29",
    luzboaFA: "H30",
    luzboaK: "H31",
    repsolQTarifa: "H33",
    repsolFA: "H34",
    coopernicoCGS: "J29",
    coopernicoK: "J30",
    luzigasCS: "J32",
    luzigasK: "J33",
    ibelectraCS: "J35",
    ibelectraK: "J36",
    plenitudeCGS: "L29",
    plenitudeGDOS: "L30",
    plenitudeFee: "L31",
    EDPK1: "L33",
    EDPK2: "L34",
    EDPK3: "L35",
    FTS: "N30",
    Audiovisual: "R29",
    DGEG: "R30",
    IES: "R31",
    kWhIVAPromocional: "R34",
    IVA_Audiovisual: "S29",
    IVA_DGEG: "S30",
    IVA_IES: "S31",
    IVAPromocional: "S34",
    IVABase: "S35",
    precoACP: "S36",
    descKWhTarSocial: "V36",
    TARSimples: "Z17",
    TARVazio: "Z18",
    TARNaoVazio: "Z19"
};

let sortField = "price";   // Valores possíveis: "default", "price", "tariff", "power", "simple"
let sortDirection = "asc";     // "asc" ou "desc"

// Armazena estado dos paineis
let estadoOmieAberto = false;
let estadoCalendarioAberto = false;
let estadoTsAberto = false;
  
// Nova variável DataS
let DataS = false;

const esquemas = ["azul-vermelho-claro", "azul-vermelho", "azul-creme-vermelho"];

// 1) Defina no topo do seu .js, junto aos outros mapas:
const rowBgVariants = {
  "azul-vermelho-claro": {
    quenteClaro: "#FFF7D0",
    quenteEscuro: "#F0E1BA",
    neutroClaro: "#F6F6F6",
    neutroEscuro: "#E2E2E2"
  },
  "azul-vermelho": {
    quenteClaro: "#FFF7D0",
    quenteEscuro: "#EAD8B1",
    neutroClaro: "#F6F6F6",
    neutroEscuro: "#D9D9D9"
  },
  "azul-creme-vermelho": {
    quenteClaro: "#FFF7D0",
    quenteEscuro: "#EAD8B1",
    neutroClaro: "#F6F6F6",
    neutroEscuro: "#D9D9D9"
  }
};

// mapa de cores de ícone para cada esquema
const coresIcone = {
  "azul-vermelho-claro": "#77D99A",
  "azul-vermelho":       "#FFFFFF",
  "azul-creme-vermelho": "#FFF6E5"
};

// mapeamento de cores para o header, um entry pra cada esquema
const headerColors = {
  "azul-vermelho-claro":  "#77D99A",   // #B3FFC9 #9DF2B9 #6EC270 #78d979 #7dd97e #6ECF8F #80E0AA #72D09A #77D99A
  "azul-vermelho":        "#00853c",   // #00853c
  "azul-creme-vermelho":  "#003D77"    // #003D77
};

const headerFtColors = {
  "azul-vermelho-claro":  "#000000",   // #B3FFC9 #9DF2B9 #6EC270 #78d979 #7dd97e
  "azul-vermelho":        "#ffffff",   // #00853c
  "azul-creme-vermelho":  "#ffffff"    // #003D77 #ffffff
};

// no topo do seu .js
const headerSecondaryColors = {
  "azul-vermelho-claro": "#375623",    // mantém o original
  "azul-vermelho":       "#375623",    // mantém o original
  "azul-creme-vermelho": "#007A1E"     // tom de verde pra esse esquema
};

const consumoBgColors = {
  "azul-vermelho-claro": "#FFC000",    // amarelo suave
  "azul-vermelho":       "#FFC000",    // laranja original
  "azul-creme-vermelho": "#F0B000"     // amarelo-queimado pro creme
};

// paletas de cores para cada esquema
const paletas = {
  "azul-vermelho-claro": {
    corMin: [158, 200, 255],
    corMed: [252, 252, 255],
    corMax: [255, 179, 179]
  },
  "azul-vermelho": {
    corMin: [90, 138, 198],
    corMed: [252, 252, 255],
    corMax: [248, 106, 108]
  },
  "azul-creme-vermelho": {
    corMin: [90, 138, 198],
    corMed: [255, 246, 229],
    corMax: [248, 106, 108]
  }
};

const potStyles = {
  "azul-vermelho-claro": { bg: "#375623", color: "#FFFFFF" },
  "azul-vermelho":       { bg: "#375623", color: "#FFFFFF" },
  "azul-creme-vermelho": { bg: "#007A1E", color: "#FFFFFF" }
};

const conStyles = {
  "azul-vermelho-claro": { bg: "#FFC000", color: "#000000" },
  "azul-vermelho":       { bg: "#FFC000", color: "#000000" },
  "azul-creme-vermelho": { bg: "#F0B000", color: "#000000" }
};

// valores de fallback, caso esquemaAtual não exista no objeto
const paletaDefault = paletas["azul-vermelho"];

// no topo do seu .js
const nomeStyles = {
  "azul-vermelho-claro":   "background-color:#FFC000; font-weight:bold; color:black;",
  "azul-vermelho":         "background-color:#FFC000; font-weight:bold; color:black;",
  "azul-creme-vermelho":   "background-color:#F0B000; font-weight:bold; color:black;"
};




let indiceEsquema = 0;  // começa no primeiro
// 3) Defina esquemaAtual a partir do índice
let esquemaAtual = esquemas[indiceEsquema];
// let esquemaAtual = "azul-vermelho-claro"; // pode ser "azul-vermelho" ou "azul-creme-vermelho"
let cornersRounded = false;

let ultimoValidoStr = "";   // armazena a string que ficou visível (até 10000)
let ultimoValidoNum = NaN;  // armazena o número (€/MWh) correspondente a essa string

let ignoreInputEvent = false;


/**
 * Recebe uma string em notação científica (ex.: "123e-5" ou "1,23E-2")
 * e devolve a mesma coisa em decimal puro (ex.: "0.00123", "0.0123").
 * Se a string não tiver “e” ou não for um número válido, retorna ela mesma,
 * trocando vírgula por ponto apenas.
 */
function expandirNotacaoCientifica(str) {
  // 1) padroniza vírgula → ponto e remove espaços
  let raw = str.replace(",", ".").trim();

  // 2) se não houver “e”/“E”, devolve o texto bruto
  if (!/[eE]/.test(raw)) return raw;

  // 3) converte para Number e, se der NaN, devolve o texto bruto
  const num = Number(raw);
  if (isNaN(num)) return raw;

  // 4) faz toExponential(), que em JS retorna algo como “1.23e-03”
  const exponential = num.toExponential();
  //    ^ ex.: “1.23e-03” ou “5e+4” etc.

  // 5) extrai (mantissa inteira, mantissa decimal opcional, expoente)
  const match = exponential.match(/^([-+]?\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/);
  if (!match) return raw;

  const integerPart = match[1];         // ex.: “1”  ou “5”
  const fracPart    = match[2] || "";   // ex.: “23” (sem o ponto) ou “” se não tiver fração
  const expo        = parseInt(match[3], 10); // ex.: -3, +4, etc.

  // 6) Se o expoente for ≥ 0, é algo como “5e+4” → basta puxar zeros à direita
  if (expo >= 0) {
    // → número final: “integerPart” + “fracPart” + (zeros até totalLength = integerPart.length + expo)
    //    mas como fracPart tem “fracPart.length” dígitos, faltam (expo - fracPart.length) zeros.
    const zerosToAdd = expo - fracPart.length;
    if (zerosToAdd <= 0) {
      // significa que a fração já cobre o expoente; basta inserir o ponto na posição correta
      const allDigits = integerPart + fracPart;
      const splitPos  = integerPart.length + expo;
      return allDigits.slice(0, splitPos)
           + "." 
           + allDigits.slice(splitPos);
    } else {
      // só acrescenta zeros
      return integerPart + fracPart + "0".repeat(zerosToAdd);
    }
  } else {
    // expo < 0: precisamos empurrar zeros à esquerda do “1.23” para virar 0.00…123
    // total de dígitos depois do ponto = |expo| + fracPart.length
    const totalDecimals = Math.abs(expo) + fracPart.length;
    // então basta usar toFixed(totalDecimals)
    return num.toFixed(totalDecimals);
  }
}

// — testes rápidos —
debugLog(expandirNotacaoCientifica("123e-5"));  // → "0.00123"
debugLog(expandirNotacaoCientifica("1,23E-2")); // → "0.0123"
debugLog(expandirNotacaoCientifica("5E+4"));    // → "50000"
debugLog(expandirNotacaoCientifica("3.14"));    // → "3.14"   (não havendo “e”)
debugLog(expandirNotacaoCientifica("abc"));     // → "abc"    (não numérico)


let OMIESSelecionadoS;




/**
 * Formata um número usando vírgula como separador decimal.
 * @param {number} num
 * @param {number} dec        — casas decimais
 * @param {boolean} trimZeros — se true, corta zeros finais; se false, mantém sempre dec casas
 * @returns {string}
 */
function formatDecimal(num, dec = 2, trimZeros = false) {
  // 1) faz o toFixed
  let s = num.toFixed(dec);
  if (trimZeros) {
    // 2) corta zeros desnecessários
    s = s.replace(/(\.\d*?[1-9])0+$/, "$1")
         .replace(/\.0+$/, "");
  }
  // 3) troca ponto por vírgula
  return s.replace(".", ",");
}


// 1) Função utilitária para converter "0,0323 €" em número
function parseEuro(str) {
    return parseFloat(
      str
        .replace("€", "")
        .replace(",", ".")
        .trim()
    ) || 0;
  }

// utilitária para percentagens “23%” → 0.23
function parsePercent(str) {
    return (parseFloat(str.replace("%", "").trim()) || 0) / 100;
  }
  
function setSort(field, direction) {
    sortField = field;
    sortDirection = direction;
    atualizarResultados();
}


// 🔹 Função para converter referência A1 para índices numéricos (linha e coluna)
function converterReferencia(ref) {
    const match = ref.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
        console.error(`❌ Erro ao processar referência: ${ref}`);
        return null;
    }

    let [, col, row] = match;
    row = parseInt(row, 10) - 1; // Ajustar para índice zero-based

    let colIndex = 0;
    for (let i = 0; i < col.length; i++) {
        colIndex = colIndex * 26 + (col.charCodeAt(i) - 64);
    }

    colIndex -= 1; // Ajuste para índice zero-based

    debugLog(`🔍 Conversão: ${ref} → Linha ${row}, Coluna ${colIndex}`);
    return { col: colIndex, row };
}

function extrair(matriz, { inicio, fim }) {
    const { col: c0, row: r0 } = converterReferencia(inicio);
    const { col: c1, row: r1 } = converterReferencia(fim);
    const tabela = [];
    for (let i = r0; i <= r1; i++) {
        if (matriz[i]) tabela.push(matriz[i].slice(c0, c1 + 1));
    }
    return tabela;
}


// 🔹 Função para obter uma tabela pelo nome
function obterTabela(nome) {
    if (tabelasBasicas[nome]) {
        return extrair(dadosCSV_basico, tabelasBasicas[nome]);
    } else if (tabelasGrandes[nome]) {
        if (adiarGrandes) {
            debugLog(`⏳ Tabela grande '${nome}' ainda não carregada.`);
            return "⌛ Adiado";
        }
        return extrair(dadosCSV_grande, tabelasGrandes[nome]);
    } else {
        return `❌ Tabela '${nome}' não encontrada.`;
    }
}



// Função para obter variável pelo nome e mostrar a linha e coluna usadas
function obterVariavel(nome) {
    if (!dadosCSV_basico.length || !variaveis[nome]) {
        console.error(`❌ Variável "${nome}" não encontrada.`);
        return "Variável não encontrada";
    }

    const { col, row } = converterReferencia(variaveis[nome]);
    const valor = dadosCSV_basico[row]?.[col] || "Indefinido";

    debugLog(`🔎 Teste variável ${nome}:`, valor);
    return valor;
}


async function carregarCSV(url) {
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`Erro ao carregar dados: ${resp.status} ${resp.statusText}`);
        }
        const txt = await resp.text();
        
        // Track data freshness from Last-Modified header if available
        const lastModified = resp.headers.get('Last-Modified');
        if (lastModified) {
            dataLastUpdated = new Date(lastModified);
        } else {
            dataLastUpdated = new Date();
        }
        
        dataLoadError = null;
        
        return txt.split("\n").map(l =>
            l.split(";").map(v => {
                v = v.trim();
                if (v.match(/^-?\d+,\d+$/)) return parseFloat(v.replace(",", "."));
                if (v.match(/^-?\d+$/)) return parseInt(v);
                return v;
            })
        );
    } catch (error) {
        dataLoadError = error.message;
        debugLog("❌ Erro ao carregar CSV:", error);
        showDataError(error.message);
        return [];
    }
}

// Show error message to user
function showDataError(message) {
    const errorDiv = document.getElementById("dataErrorMessage");
    if (errorDiv) {
        errorDiv.textContent = `⚠️ ${message}`;
        errorDiv.style.display = "block";
    }
}

// Hide error message
function hideDataError() {
    const errorDiv = document.getElementById("dataErrorMessage");
    if (errorDiv) {
        errorDiv.style.display = "none";
    }
}

// Update data freshness indicator
function updateDataFreshnessIndicator() {
    const indicator = document.getElementById("dataFreshnessIndicator");
    if (indicator && dataLastUpdated) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = dataLastUpdated.toLocaleDateString('pt-PT', options);
        indicator.textContent = `Dados atualizados: ${formattedDate}`;
        indicator.style.display = "block";
    }
}

function trimZeros(value, decimals = 2) {
    // fixa decimals casas, converte para float (corta zeros) e volta a string
    return parseFloat(value.toFixed(decimals)).toString();
  }
  

debugLog("🔍 Testando extração de tabelas...");
debugLog("📌 Tabela kVAs:", obterTabela("kVAs"));

function preencherSelecaoMeses() {
    const meses = obterTabela("Meses")?.flat() || [];
    const selectMes = document.getElementById("mesSelecionado");
    selectMes.innerHTML = "";
    meses.forEach((mes, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = mes;
        selectMes.appendChild(option);
    });
    const mesAtualIndex = new Date().getMonth();
    if (meses[mesAtualIndex]) {
        selectMes.value = mesAtualIndex;
    }
    debugLog(`🔎 Mês atual selecionado: ${meses[mesAtualIndex]}`);
}

function atualizarResultados() {
    // dentro de atualizarResultados(), logo no topo:
const omieInputCampo = document.getElementById("omieInput");
let omieRaw = omieInputCampo.value.replace(",", ".").trim();
let omieNum = parseFloat(omieRaw);

// Se for vazio ou inválido, considere zero (ou outro fallback)
if (isNaN(omieNum)) {
  omieNum = 0;
}

// Converta de €/kWh para €/kWh (ou de €/MWh para €/kWh, conforme o que precisar)
// Exemplo: se o input estiver a ser preenchido em €/MWh e quiser dividir por 1000:
OMIESSelecionadoS = Number((omieNum / 1000).toFixed(5));

// Se o seu input já está em €/kWh, basta usar:
 // OMIESSelecionadoS = omieNum; 

debugLog("└─ OMIESSelecionadoS (no início de atualizarResultados):", OMIESSelecionadoS);






    // dentro de atualizarResultados():
    // 1) Pega o texto bruto do input de consumo
const rawConsumo = document.getElementById("consumoInput").value.trim();

// 2) Se estiver vazio, fixa consumo = 0; senão, converte para número
let consumo;
if (rawConsumo === "") {
  consumo = 0;
} else {
  consumo = parseFloat(rawConsumo.replace(",", ".")) || 0;
}

    const raw = document.getElementById("potenciac").value;        // ex: "6.9"
    const withComma = raw.replace('.', ',');                       // → "6,9"
    const potenciaSelecionada = withComma + ' kVA';                // → "6,9 kVA"
    //const idx = potenciasArray.indexOf(potenciaNum);
    debugLog("📌 Potência selecionada:",potenciaSelecionada);

    if (isNaN(consumo)) consumo = 0;
    if (!potenciaSelecionada) potenciaSelecionada = "6,9 kVA";
    let mostrarNomesAlternativos = document.getElementById("mostrarNomes").checked;
    let incluirACP = document.getElementById("incluirACP").checked;
    let incluirContinente = document.getElementById("incluirContinente").checked;
    let incluirMeo = document.getElementById("incluirMeo").checked;
    let restringir = document.getElementById("restringir").checked;
    let incluirEDP = document.getElementById("incluirEDP").checked;

    const potencias = obterTabela("kVAs")?.map(row => row[0]) || [];
    // idx definido apóes conta potencias em atualizarResultados
    const idx = potencias.indexOf(potenciaSelecionada);
    const tarPot = obterTabela("TARPotencias")?.map(row => row[0]) || [];
    const tarPotSraw = tarPot[idx];            // ex: "0,3174 €"
    const tarPotSnum = parseEuro(tarPotSraw);

    debugLog("📌 Potência selecionada, idx:",potenciaSelecionada,idx,raw);
    debugLog("🔍 Conteúdo de potencias:", potencias);   
    debugLog("🔍 Conteúdo de TARpotencias:", tarPot,tarPotSnum);
    
    // lê as duas tabelas (coluna única com strings “X,XXXX €”)
    const rawPotTS = obterTabela("descKVAsTarSocial")?.map(r => r[0]) || [];
    // seleciona o valor correspondente à potência escolhida
    const rawDescontoPotTS = rawPotTS[idx] || "0";
    // 2) desconto no kWh: vem da variável descKWhTarSocial (célula V36)
    const rawDescontoKwh = obterVariavel("descKWhTarSocial") || "0,00 €";

    // converte em número
    const descontoPotTS = parseEuro(rawDescontoPotTS);  // €/dia de potência
    const descontoKwhTS  = parseEuro(rawDescontoKwh);  // €/kWh de consumo

    debugLog("Desconto potência TS:", descontoPotTS);
    debugLog("Desconto kWh TS:", descontoKwhTS);

    const nomesTarifarios = obterTabela("empresasSimples")?.flat().map(nome => nome.replace(/\*+$/, "").trim()) || [];
    const nomesTarifariosDetalhados = obterTabela("detalheTarifarios")?.flat().map(nome => nome.replace(/\*+$/, "").trim()) || [];
    debugLog("Tabela detalheTarifarios:", nomesTarifariosDetalhados);
    const tarifariosDados = obterTabela("preçosSimples");
    const OMIES = obterTabela("OMIE");
    const PerdasS = obterTabela("Perdas");
    const kVAsTarSocialS = obterTabela("kVAsTarSocial")?.map(row => row[0]) || [];
    debugLog("🔎 OMIES:", OMIES);
    
    if (!potencias.length || !nomesTarifarios.length || !tarifariosDados.length) {
        console.error("Erro ao carregar tarifários.");
        return;
    }
    // extrai número da string "X,XX kVA"
    const potenciaNum = parseFloat(
        potenciaSelecionada
         .replace(" kVA", "")
         .replace(",", ".")
        );
    
    const famCheckbox = document.querySelector('#tsField input[type="checkbox"]#familiasNumerosas');
    famCheckbox.disabled = potenciaNum > 6.9;
        

    // desativa todos os radios se potência > 6.9 kVA
    document
        .querySelectorAll('input[name="tsType"]')
        .forEach(r => r.disabled = potenciaNum > 6.9);

    // (opcional) desativa também o checkbox de famílias numerosas se não houver TS
    const tsType = document.querySelector('input[name="tsType"]:checked').value;
    const hasTspartial = tsType === "ts-partial";

    // agora o tsFlag = 1 se for Tarifa Social OU Tarifa Social + isenção
    const tsFlag = (['ts', 'ts-partial'].includes(tsType) && potenciaNum <= 6.9)
        ? 1
        : 0;
    // agora o famFlag
    // só vale 1 se o checkbox estiver marcado e a potência for ≤ 6.9
    const famFlag = (famCheckbox.checked && potenciaNum <= 6.9) ? 1 : 0;

    debugLog("Aplicar desconto tarifa social?", tsFlag);
    debugLog("Aplicar desconto famílias numerosas?", famFlag);

    const diasMesesTabela = obterTabela("diasMeses")?.flat() || [];
    const strDiasTabela = obterTabela("strDias")?.flat() || [];

    const mesSelecionadoIndex = document.getElementById("mesSelecionado").selectedIndex;

    let diasS;
    let strDiasSimples;

    if (DataS) {
      const dataInicio = new Date(startDate.value);
      const dataFim    = new Date(endDate.value);
    
      if (!isNaN(dataInicio) && !isNaN(dataFim)) {
        const diffMs = dataFim - dataInicio;
        diasS        = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        // Usa toLocaleString, para garantir vírgula (se houvesse decimal)
        strDiasSimples = diasS.toLocaleString('pt-PT', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        debugLog(`🔎 DataS = true: diasS calculado = ${diasS}`);
      } else {
        console.warn("❗ Datas inválidas mesmo com DataS true — fallback para mês selecionado.");
        diasS = parseFloat(diasMesesTabela[mesSelecionadoIndex]) || 30;
        // strDiasTabela vem do CSV; pode já estar como “30” or “30,00”. Só garantimos vírgula:
        strDiasSimples = String(strDiasTabela[mesSelecionadoIndex]).replace('.', ',') || "30";
      }
    } else {
      let diasInput = document.getElementById("dias").value.trim();
      diasInput     = diasInput === "" ? NaN : parseFloat(diasInput.replace(",", "."));
    
      if (!isNaN(diasInput)) {
        diasS = diasInput;
        // Formata com vírgula (com até 2 decimais, se precisar):
        strDiasSimples = diasS.toLocaleString('pt-PT', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4
        });
      } else {
        diasS = parseFloat(diasMesesTabela[mesSelecionadoIndex]) || 30;
        strDiasSimples = String(strDiasTabela[mesSelecionadoIndex]).replace('.', ',') || "30";
      }
    
      debugLog(`🔎 DataS = false: diasS = ${diasS}`);
    }
    

    debugLog(`✅ diasS final: ${diasS}, strDiasSimples: ${strDiasSimples}`);
    
    let IVABaseSimples = parsePercent(obterVariavel("IVABase"));
    let AudiovisualS = parseEuro(obterVariavel("Audiovisual"));
    if (hasTspartial){
        AudiovisualS -=1.85;
    }
    let DGEGS = parseEuro(obterVariavel("DGEG"));
    let IESS = parseEuro(obterVariavel("IES")) * (1 - tsFlag);

    debugLog(`✅ IEC: ${IESS}`);
    let IVA_AudiovisualSimples = parsePercent(obterVariavel("IVA_Audiovisual"));
    let IVA_DGEGSimples        = parsePercent(obterVariavel("IVA_DGEG"));
    let IVA_IESS               = parsePercent(obterVariavel("IVA_IES"));
    let kWhIVAPromocionalS = parseFloat(obterVariavel("kWhIVAPromocional")) || 0;
    if (famFlag){
        kWhIVAPromocionalS +=100;
    }
    kWhIVAPromocionalS = Math.round((kWhIVAPromocionalS * diasS) / 30);
    let IVAPromocionalS = parsePercent(obterVariavel("IVAPromocional"));
    let FTSS = parseEuro(obterVariavel("FTS"));
    let TARSimplesS = parseEuro(obterVariavel("TARSimples"));
    let MedioS = parseFloat(obterVariavel("Medio")) || 0;
    let luzboaCGSS = parseFloat(obterVariavel("luzboaCGS")) || 0;
    let luzboaFAS = parseFloat(obterVariavel("luzboaFA")) || 0;
    let luzboaKS = parseFloat(obterVariavel("luzboaK")) || 0;
    let ibelectraCSS = parseFloat(obterVariavel("ibelectraCS")) || 0;
    let ibelectraKS = parseFloat(obterVariavel("ibelectraK")) || 0;
    let perdas2024S = parseFloat(obterVariavel("perdas2024")) || 0;
    let precoACPS = parseEuro(obterVariavel("precoACP"));
    if (!incluirACP) {
        precoACPS = 0;
    }
    let luzigasCSS = parseFloat(obterVariavel("luzigasCS")) || 0;
    let luzigasKS = parseFloat(obterVariavel("luzigasK")) || 0;
    let repsolQTarifaS = parseFloat(obterVariavel("repsolQTarifa")) || 0;
    let repsolFAS = parseFloat(obterVariavel("repsolFA")) || 0;
    let coopernicoCGSS = parseFloat(obterVariavel("coopernicoCGS")) || 0;
    let coopernicoKS = parseFloat(obterVariavel("coopernicoK")) || 0;
    let plenitudeCGSS = parseFloat(obterVariavel("plenitudeCGS")) || 0;
    let plenitudeGDOSS = parseFloat(obterVariavel("plenitudeGDOS")) || 0;
    let plenitudeFeeS = parseFloat(obterVariavel("plenitudeFee")) || 0;
    let EDPK1S = parseFloat(obterVariavel("EDPK1")) || 0;
    let EDPK2S = parseFloat(obterVariavel("EDPK2")) || 0;
    
    // já tens as variáveis mesSelecionadoIndex, OMIES, DataS, startDate, endDate disponíveis dentro de atualizarResultados()

    

    let PerdasSelecionadoS;
    let dataInicio, dataFim;
    let tudoTabela, tudoTPT, tDataTabela;
    let tBtnA, tBtnB, tBtnC;

    if (!DataS) {
        OMIESSelecionadoS  = OMIES[mesSelecionadoIndex]?.[0]  || 0;
        PerdasSelecionadoS = PerdasS[mesSelecionadoIndex]?.[0] || 0;
      } else {
        dataInicio   = new Date(startDate.value);
        dataFim      = new Date(endDate.value);
        tudoTabela   = obterTabela("TPreco").map(r => parseFloat(r[0]));
        tudoTPT      = obterTabela("TPT").map(r => parseFloat(r[0]));
        tDataTabela  = obterTabela("TData").map(raw => {
          if (!raw[0]) return new Date("Invalid Date");
          const [d, m, a] = raw[0].split('/');
          return new Date(`${a}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
        });

        // Acumuladores para OMIES
        let somaOMIES = 0, contaOMIES = 0;
        // Acumuladores para Perdas
        let somaPerdas = 0, contaPerdas = 0;

        for (let i = 0; i < tDataTabela.length; i++) {
            if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                somaOMIES += tudoTabela[i];
                contaOMIES++;
                somaPerdas += tudoTPT[i];
                contaPerdas++;
            }
        }

        // Média e tratamento de divisão por zero — espelhando o /1000 e toFixed(5)
        OMIESSelecionadoS = contaOMIES > 0
            ? +(somaOMIES / contaOMIES / 1000).toFixed(5)
            : (OMIES[mesSelecionadoIndex]?.[0] || 0);

        PerdasSelecionadoS = contaPerdas > 0
            ? +(somaPerdas / contaPerdas).toFixed(5)
            : (PerdasS[mesSelecionadoIndex]?.[0] || 0);
    }

    debugLog("🔎 OMIESSelecionadoS atualizado:", OMIESSelecionadoS);
    debugLog("🔎 PerdasSelecionadoS atualizado:", PerdasSelecionadoS);

    let U3;
    let PerfilS = "";
    let PerfilM_S = "";

    if (DataS) {
        // 1) Carrega todas as colunas de uma só vez
        tBtnA = obterTabela("TBTN_A").map(r => parseFloat(r[0])) || [];
        tBtnB = obterTabela("TBTN_B").map(r => parseFloat(r[0])) || [];
        tBtnC = obterTabela("TBTN_C").map(r => parseFloat(r[0])) || [];
    
        // 2) Calcula U3
        let somaBtnC = 0, cntBtnC = 0;
        for (let i = 0; i < tDataTabela.length; i++) {
            if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                somaBtnC += tBtnC[i];
                cntBtnC++;
            }
        }
        U3 = cntBtnC > 0 ? consumo / somaBtnC * 1000 : 0;
    
        // 3) Decide o Perfil (BTN A, B ou C)
        if (potenciaNum > 13.8) {
            PerfilS = "BTN A";
        } else if (U3 >= 7140) {
            PerfilS = "BTN B";
        } else {
            PerfilS = "BTN C";
        }
    
        // 4) Calcula a média do perfil
        let somaBtns = 0, contaBtns = 0;
        for (let i = 0; i < tDataTabela.length; i++) {
            if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                const btnVal =
                    PerfilS === "BTN A" ? tBtnA[i] :
                    PerfilS === "BTN B" ? tBtnB[i] :
                                         tBtnC[i];
                somaBtns += btnVal;
                contaBtns++;
            }
        }
        PerfilM_S = contaBtns > 0 ? somaBtns / contaBtns : "";
    } else {
        U3 = "";
        PerfilS = (potenciaNum > 13.8) ? "BTN A" : "BTN C"; // mantém lógica de fallback
        PerfilM_S = "";
    }

    debugLog("🔎 PerfilM_S:", PerfilM_S);


    const colIndex = potencias.indexOf(potenciaSelecionada);
    if (colIndex === -1) {
        throw new Error("Potência selecionada inválida.");
    }
    const colPotencia = colIndex * 2;
    const colSimples = colPotencia + 1;

    const luzigasFeeTabela = obterTabela("LuzigazFee")?.flat() || [];
    let luzigasFeeS = luzigasFeeTabela[colIndex] || "0";
    luzigasFeeS = parseFloat(luzigasFeeS.replace("€", "").replace(",", ".").trim()) || 0;
    const multiplicador = DataS === true
    ? diasS / MedioS // SE(DataS=true; diasS/MedioS; 1)
    : 1;
    let luzigasFee0 = luzigasFeeS
    luzigasFeeS = parseFloat(
        (
          luzigasFeeS
          * multiplicador
          * (1 + IVABaseSimples)
        )
      );
    
    let IVAFixoS;
    debugLog("Potência, IVA, TS:", potenciaSelecionada, IVAFixoS, kVAsTarSocialS)
    if (kVAsTarSocialS.includes(potenciaSelecionada)) {
        IVAFixoS = IVAPromocionalS;
    } else {
        IVAFixoS = IVABaseSimples;
    }
    debugLog("IVAFixoS:", IVAFixoS)

    debugLog("OMIE:", OMIESSelecionadoS)
    // const omieInput = document.getElementById("omieInput");


    function aplicaEncargoTS(nome) {
      return (
        nome.startsWith("Goldenergy") ||
        nome.startsWith("Repsol") ||
        nome.startsWith("G9") ||
        nome.startsWith("Luzboa") ||
        nome === "Ibelectra indexado" ||
        nome === "Ibelectra: Solução Família" ||
        nome.startsWith("Luzigás") ||
        nome.startsWith("Coopérnico") ||
        nome.startsWith("Nossa")
      );
    }
    


    


// lê o valor literal do input OMIE (em €/MWh)
const textoOmie = document
  .getElementById("omieInput")
  .value
  .replace(",", ".")
  .trim();

const omieParseado = parseFloat(textoOmie);
if (!isNaN(omieParseado)) {
  // converte de €/MWh para €/kWh
  OMIESSelecionadoS = Number((omieParseado / 1000).toFixed(5));
}


//    debugLog("OMIE:", OMIESSelecionadoS, omieInputValue, DataS)
    debugLog("potenciaNum:", potenciaNum)

    // --- Criação do array de tarifários a partir dos dados CSV ---
    // MODIFICAÇÃO 1: Marcação dos tarifários indexados (empresas entre C19 e C25)
    let tarifarios = nomesTarifarios
    .map((nome, i) => {
    // --- filtrar potências não numéricas ---
    const rawPot = tarifariosDados[i]?.[colPotencia];
    const parsedPot = parseFloat(String(rawPot).replace(",", "."));
    if (isNaN(parsedPot)) return null;
    let potencia = parsedPot;
    
    // --- determinar se é indexado (está entre as linhas C19 a C25) ---
    // como há offset de 5 (a tabela começa em C5), a condição é i+5 ∈ [19,25]
    let isIndexado = (i + 5 >= 19 && i + 5 <= 25);

        
    let simples;

        if (nome === "Luzboa indexado") {
            if (DataS) {
                // Média do intervalo (com TPreço/tudoTabel a, TPT/tudoTPT, etc.)
                let soma = 0, conta = 0;
                for (let i = 0; i < tDataTabela.length; i++) {
                    if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                        soma += (tudoTabela[i] / 1000 + luzboaCGSS)
                              * luzboaFAS
                              * (1 + tudoTPT[i])
                              + luzboaKS;
                        conta++;
                    }
                }
        
                if (conta > 0) {
                    const media = soma / conta;
                    simples = parseFloat((media + TARSimplesS).toFixed(4));
                } else {
                    // fallback para simples padrão
                    const base = (OMIESSelecionadoS + luzboaCGSS)
                               * (1 + PerdasSelecionadoS)
                               * luzboaFAS
                               + luzboaKS
                               + TARSimplesS;
                    simples = parseFloat(base.toFixed(4));
                }
        
            } else {
                // DataS === false: apenas o cálculo simples
                const base = (OMIESSelecionadoS + luzboaCGSS)
                           * (1 + PerdasSelecionadoS)
                           * luzboaFAS
                           + luzboaKS
                           + TARSimplesS;
                simples = parseFloat(base.toFixed(4));
            }   
        } else if (nome === "Ibelectra indexado") {
            simples = parseFloat(((OMIESSelecionadoS + ibelectraCSS) * (1 + perdas2024S) + ibelectraKS + TARSimplesS).toFixed(5));
        } else if (nome.startsWith("Luzigás Energy 8.8")) {
            simples = parseFloat(((OMIESSelecionadoS + luzigasCSS) * (1 + PerdasSelecionadoS) + luzigasKS + TARSimplesS).toFixed(4));
        } else if (nome === "EDP indexado") {
            simples = parseFloat((OMIESSelecionadoS * EDPK1S + EDPK2S + TARSimplesS).toFixed(4));
        } else if (nome === "Repsol indexado") {
            if (DataS) {
              // 1) soma os valores só no intervalo
              let soma = 0, conta = 0;
              for (let i = 0; i < tDataTabela.length; i++) {
                if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                  // escolhe o TBTN_X correto conforme PerfilS
                  const fatorBtn = 
                    PerfilS === "BTN A" ? tBtnA[i] :
                    PerfilS === "BTN B" ? tBtnB[i] :
                                         tBtnC[i];
          
                  // (TPreço/1000*(1+TPT)*RepsolFA + RepsolQTarifa) * fatorBtn
                  const valor = 
                    (tudoTabela[i] / 1000 * (1 + tudoTPT[i]) * repsolFAS
                      + repsolQTarifaS)
                    * fatorBtn;
          
                  soma += valor;
                  conta++;
                }
              }
          
              if (conta > 0) {
                // 2) calcula a média e divide por PerfilM_S
                const media = soma / conta / PerfilM_S;
                // 3) arredonda a 6 casas e adiciona TARSimplesS
                simples = parseFloat((media + TARSimplesS).toFixed(6));
              } else {
                // fallback idêntico ao “simples” quando não há dados no intervalo
                const base = 
                  OMIESSelecionadoS * (1 + PerdasSelecionadoS) * repsolFAS
                  + repsolQTarifaS
                  + TARSimplesS;
                simples = parseFloat(base.toFixed(6));
              }
          
            } else {
              // DataS === false → sempre o cálculo simples
              const base =
                OMIESSelecionadoS * (1 + PerdasSelecionadoS) * repsolFAS
                + repsolQTarifaS
                + TARSimplesS;
              simples = parseFloat(base.toFixed(6));
            }
        } else if (nome === "Coopérnico") {
            if (DataS) {
              // 1) Calcula soma e conta dos valores no intervalo
              let soma = 0, conta = 0;
              for (let i = 0; i < tDataTabela.length; i++) {
                if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                  // escolhe o TBTN_X correto segundo o PerfilS
                  const fatorBtn =
                    PerfilS === "BTN A" ? tBtnA[i] :
                    PerfilS === "BTN B" ? tBtnB[i] :
                                          tBtnC[i];
          
                  // ((TPreço/1000 + CoopernicoCGS + CoopernicoK) * (1+TPT)) * fatorBtn
                  const valor =
                    (tudoTabela[i] / 1000
                     + coopernicoCGSS
                     + coopernicoKS)
                    * (1 + tudoTPT[i])
                    * fatorBtn;
          
                  soma += valor;
                  conta++;
                }
              }
          
              if (conta > 0) {
                // 2) média normalizada por PerfilM_S
                const media = soma / conta / PerfilM_S;
                // 3) arredonda a 6 casas, soma TARSimplesS antes do .toFixed
                simples = parseFloat((media + TARSimplesS).toFixed(6));
              } else {
                // fallback “simples” quando não houver dados no intervalo
                simples = parseFloat(
                  (
                    (OMIESSelecionadoS + coopernicoCGSS + coopernicoKS)
                    * (1 + PerdasSelecionadoS)
                    + TARSimplesS
                  ).toFixed(6)
                );
              }
          
            } else {
              // DataS = false → sempre o cálculo simples de fallback
              simples = parseFloat(
                (
                  (OMIESSelecionadoS + coopernicoCGSS + coopernicoKS)
                  * (1 + PerdasSelecionadoS)
                  + TARSimplesS
                ).toFixed(6)
              );
            }
        } else if (nome === "Plenitude indexado") {
            if (DataS) {
              // 1) calculo da soma ponderada no intervalo
              let soma = 0, conta = 0;
              for (let i = 0; i < tDataTabela.length; i++) {
                if (tDataTabela[i] >= dataInicio && tDataTabela[i] <= dataFim) {
                  // escolhe o TBTN_X consoante o Perfil
                  const fatorBtn =
                    PerfilS === "BTN A" ? tBtnA[i] :
                    PerfilS === "BTN B" ? tBtnB[i] :
                                          tBtnC[i];
          
                  // ((TPreço/1000 + CGS + GDOs) * (1+TPT) + Fee)
                  const componente =
                    (tudoTabela[i] / 1000
                      + plenitudeCGSS
                      + plenitudeGDOSS)
                    * (1 + tudoTPT[i])
                    + plenitudeFeeS;
          
                  soma += componente * fatorBtn;
                  conta++;
                }
              }
          
              if (conta > 0) {
                // 2) média normalizada por PerfilM_S
                const media = soma / conta / PerfilM_S;
                // 3) arredonda a 4 decimais e soma TARSimplesS
                simples = parseFloat((media + TARSimplesS).toFixed(4));
              } else {
                // fallback: cálculo simples igual ao Excel + TARSimplesS
                const base =
                  (OMIESSelecionadoS + plenitudeCGSS + plenitudeGDOSS)
                  * (1 + PerdasSelecionadoS)
                  + plenitudeFeeS;
                simples = parseFloat((base + TARSimplesS).toFixed(4));
              }
          
            } else {
              // DataS = false → sempre o simples de fallback + TARSimplesS
              const base =
                (OMIESSelecionadoS + plenitudeCGSS + plenitudeGDOSS)
                * (1 + PerdasSelecionadoS)
                + plenitudeFeeS;
              simples = parseFloat((base + TARSimplesS).toFixed(4));
            }
          
            debugLog("Plenitude indexado:", simples);
        } else {                            
            simples = parseFloat(tarifariosDados[i]?.[colSimples]) || 0;
        }

        if (nome === "Meo" && incluirMeo) {
            simples -= 0.01;
        }

        // —> só aplica desconto se o usuário marcou EDP e potência ≥ 3,45 kVA
        let descontoEDP = 0;
        if (incluirEDP) {
        if (potenciaNum >= 3.45) {
        descontoEDP = -10;  // valor original do desconto
        }
   }

        const nomeExibido = mostrarNomesAlternativos && nomesTarifariosDetalhados[i] ? nomesTarifariosDetalhados[i] : nome;
        debugLog("Potência, IVA, TS:", potenciaSelecionada, IVAFixoS, kVAsTarSocialS)
        debugLog("Potência, IVA, TS:", potenciaSelecionada, potenciaNum)

        // —> IVA de 6% para potência <= 3,45 kVA
        //if (potenciaNum <= 3.45) {
        //IVABaseSimples = 0.06;  // valor original do desconto
        //}
        potencia -= tsFlag * descontoPotTS;
        simples -= tsFlag * descontoKwhTS;   

        
        let custo6 =
            simples * Math.min(consumo, kWhIVAPromocionalS)
            + AudiovisualS
            + (potenciaNum <= 3.45 ? tarPotSnum : 0) * diasS
            - tsFlag * (potenciaNum <= 3.45 ? descontoPotTS : 0) * diasS;
        let custo23 = (potencia - (potenciaNum <= 3.45 ? tarPotSnum - tsFlag * descontoPotTS : 0)) * diasS 
            + simples * Math.max(consumo - kWhIVAPromocionalS, 0) + DGEGS + consumo * IESS;
        let custo = (potencia * diasS * (1 + IVABaseSimples)) +
                    simples * (Math.max(consumo - kWhIVAPromocionalS, 0) * (1 + IVABaseSimples) +
                               Math.min(consumo, kWhIVAPromocionalS) * (1 + IVAFixoS)) +
                    (AudiovisualS * (1 + IVA_AudiovisualSimples)) +
                    (DGEGS * (1 + IVA_DGEGSimples)) +
                    consumo * (IESS * (1 + IVA_IESS));
        //Desconto de baixas potências
        if (potenciaNum <= 3.45) {
            custo -= (tarPotSnum - tsFlag * descontoPotTS) * diasS * (IVABaseSimples - IVAFixoS);
        }

        if (nome.startsWith("Luzigás Energy 8.8") && diasS > 0) {
            potencia += luzigasFeeS / diasS / (1 + IVABaseSimples);
            custo += parseFloat(luzigasFeeS.toFixed(2));
        }
    
        if (nome.startsWith("Goldenergy ACP")) {
            custo += precoACPS;
        }

      let encargoTS = 0;
      if (aplicaEncargoTS(nome)) {
        if (nome.startsWith("Goldenergy")) {
          encargoTS = consumo * FTSS * (1 + IVABaseSimples);
        } else {
          encargoTS = (
            Math.max(consumo - kWhIVAPromocionalS, 0) * (1 + IVABaseSimples) +
            Math.min(consumo, kWhIVAPromocionalS) * (1 + IVAFixoS)
          ) * FTSS;
        }
      }

        custo += encargoTS

    

        if (nome.startsWith("EDP indexado")) {
            custo += descontoEDP;
        }
    
        return {
            nome: nomeExibido,
            potencia,
            simples,
            custo: parseFloat(custo.toFixed(2)),
            isIndexado // Propriedade adicionada para identificar tarifários indexados
        };
    })
    // remove os nulos gerados acima
   .filter(t => t !== null);
    
    if (!restringir) {
        const nomesTarifariosExtra = obterTabela("tarifariosExtra")?.flat() || [];
        const nomesTarifariosDetalhadosExtra = obterTabela("detalheTarifariosExtra")?.flat() || [];
        const tarifariosDadosExtra = obterTabela("preçosSimplesExtra");

        nomesTarifariosExtra.forEach((nome, i) => {
        // 1) lemos raw, convertendo em string
        const rawPot = tarifariosDadosExtra[i]?.[colPotencia];
        const parsedPot = parseFloat(String(rawPot).replace(",", "."));
        // 2) se não for número, saltamos este tarifário
        if (isNaN(parsedPot)) return;
        // 3) caso OK, usamos parsedPot
        let potencia = parsedPot;
        let simples = parseFloat(
          String(tarifariosDadosExtra[i]?.[colSimples])
            .replace(",", ".")
        ) || 0;
        
        if (nome === "Galp Continente" && incluirContinente) {
            potencia *= 0.9;
            simples *= 0.9;
        }

        

            
            const nomeExibido = mostrarNomesAlternativos && nomesTarifariosDetalhadosExtra[i] ? nomesTarifariosDetalhadosExtra[i] : nome;
            potencia -= tsFlag * descontoPotTS;
            simples -= tsFlag * descontoKwhTS;  
            
            let custo = (potencia * diasS * (1 + IVABaseSimples)) +
                    simples * (Math.max(consumo - kWhIVAPromocionalS, 0) * (1 + IVABaseSimples) +
                               Math.min(consumo, kWhIVAPromocionalS) * (1 + IVAFixoS)) +
                    (AudiovisualS * (1 + IVA_AudiovisualSimples)) +
                    (DGEGS * (1 + IVA_DGEGSimples)) +
                    consumo * (IESS * (1 + IVA_IESS));
                    
                    //Desconto de baixas potências
                    if (potenciaNum <= 3.45) {
                        custo -= (tarPotSnum - tsFlag * descontoPotTS) * diasS * (IVABaseSimples - IVAFixoS);
                    }

                    if (nome.startsWith("Nossa")) {
                      custo += (Math.max(consumo - kWhIVAPromocionalS, 0) * (1 + IVABaseSimples) +
                      Math.min(consumo, kWhIVAPromocionalS) * (1 + IVAFixoS)) * FTSS;
                  }
           
            
            tarifarios.push({
                nome: nomeExibido,
                potencia,
                simples,
                custo: parseFloat(custo.toFixed(2))
            });
        });
    }
    
    const inputFixoVal = document.getElementById("fixo").value.trim();
    const inputVariavelVal = document.getElementById("variavel").value.trim();

    if (inputFixoVal !== "" && inputVariavelVal !== "") {
        const potenciaMeu = parseFloat(inputFixoVal.replace(",", "."));
        const simplesMeu = parseFloat(inputVariavelVal.replace(",", "."));
        
        if (!isNaN(potenciaMeu) && !isNaN(simplesMeu)) {
            const custoMeu = (potenciaMeu * diasS * (1 + IVABaseSimples)) +
                             (simplesMeu * (Math.max(consumo - kWhIVAPromocionalS, 0) * (1 + IVABaseSimples) +
                                            Math.min(consumo, kWhIVAPromocionalS) * (1 + IVAFixoS))) +
                             (AudiovisualS * (1 + IVA_AudiovisualSimples)) +
                             (DGEGS * (1 + IVA_DGEGSimples)) +
                             (consumo * (IESS * (1 + IVA_IESS)));
                             
            const meuTarifario = {
                nome: "Meu tarifário",
                potencia: potenciaMeu,
                simples: simplesMeu,
                custo: parseFloat(custoMeu.toFixed(2))
            };
            debugLog("Inserindo Meu tarifário:", meuTarifario);
            tarifarios.push(meuTarifario);
        } else {
            console.error("Erro ao converter os valores dos inputs de 'Meu tarifário' para número.");
        }
    } else {
        debugLog("Inputs de 'Meu tarifário' não preenchidos.");
    }

   
    if (sortField === "default") {
        // A ordem padrão é a ordem de criação; se 'desc', inverte o array
        if (sortDirection === "desc") {
            tarifarios.reverse();
        }
    } else if (sortField === "price") {
        tarifarios.sort((a, b) => sortDirection === "asc" ? a.custo - b.custo : b.custo - a.custo);
    } else if (sortField === "tariff") {
        tarifarios.sort((a, b) => sortDirection === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome));
    } else if (sortField === "power") {
        tarifarios.sort((a, b) => sortDirection === "asc" ? a.potencia - b.potencia : b.potencia - a.potencia);
    } else if (sortField === "simple") {
        tarifarios.sort((a, b) => sortDirection === "asc" ? a.simples - b.simples : b.simples - a.simples);
    }
    

    const indexMeu = tarifarios.findIndex(t => t.nome === "Meu tarifário");
    if (indexMeu > 0) {
        const [meu] = tarifarios.splice(indexMeu, 1);
        tarifarios.unshift(meu);
    }
    
    preencherLista(tarifarios);
    calcularPreco(tarifarios, consumo, potenciaSelecionada);
    
    function preencherLista(tarifarios) {
        const lista = document.getElementById("listaTarifarios");
        lista.innerHTML = "";
    }
    
    // MODIFICAÇÃO 2: Aplicar fundo amarelo (mesmo do "Meu tarifário") para tarifários indexados
    function calcularPreco(tarifarios, consumo, potenciaSelecionada) {
        const minPotencia = Math.min(...tarifarios.map(t => t.potencia));
        const maxPotencia = Math.max(...tarifarios.map(t => t.potencia));
        const minSimples = Math.min(...tarifarios.map(t => t.simples));
        const maxSimples = Math.max(...tarifarios.map(t => t.simples));
        const minCusto = Math.min(...tarifarios.map(t => t.custo));
        const maxCusto = Math.max(...tarifarios.map(t => t.custo));

        // busca a cor correta pro ícone (fallback para "#FFF" se algo der errado)
        const iconColor = coresIcone[esquemaAtual] || "#FFF";
        

        // LOGO NO INÍCIO DE calcularPreco, antes de montar tabelaResultados: 00853c
        // const headerPrimary = esquemaAtual === "azul-creme-vermelho" ? "#003D77" : "#6EC270";
        // — o “verde de cima” passa a azul escuro ou fica o verde original
        const headerPrimary = headerColors[esquemaAtual] || "#000";
        const headerFtPrimary = headerFtColors[esquemaAtual] || "#ffffff";
        document.documentElement.style.setProperty(
          "--header-ft-primary",
          headerFtPrimary
        );

        // const headerSecondary = esquemaAtual === "azul-creme-vermelho" ? "#007A1E" : "#375623";
        // — a linha que era escura (o fundo do botão + Consumo) passa a este tom de azul ou ao original

        // const consumoBg = esquemaAtual === "azul-creme-vermelho" ? "#F0B000" : "#FFC000";
        // — o laranja original (FFC000) passa a amarelo suave (FFFF66)

        // escolhe as cores a partir do esquemaAtual
        const headerSecondary = headerSecondaryColors[esquemaAtual] || "#375623";  // fallback
        const consumoBg      = consumoBgColors[esquemaAtual] || "#FFC000";  // fallback


        // Funções auxiliares
        function calcularCor(valor, min, max) {
            if (min === max) {
                return "rgb(255, 255, 255)"; // evita divisões por zero
            }
        
            let t = (valor - min) / (max - min); // normalizar para [0,1]
        
            // let corMin, corMed, corMax;
        
            const { corMin, corMed, corMax } = paletas[esquemaAtual] || paletaDefault;
        
            let corFinal;
            if (t <= 0.5) {
                let percent = t * 2;
                corFinal = corMin.map((c, i) => Math.round(c + percent * (corMed[i] - c)));
            } else {
                let percent = (t - 0.5) * 2;
                corFinal = corMed.map((c, i) => Math.round(c + percent * (corMax[i] - c)));
            }
        
            return `rgb(${corFinal[0]}, ${corFinal[1]}, ${corFinal[2]})`;
        }
        
        

        const toggleIcon = cornersRounded ? "\u25A1" /* □ */ : "\u25CB" /* ○ */;
        
        const omieMwh = OMIESSelecionadoS * 1000;
        const omieMwhStr = formatDecimal(omieMwh, 2, true).replace(".", ",");

        let tabelaResultados = `<table style="border-spacing: 1px 1px; border-collapse: separate;">

        

    
        <tr> 
          <th colspan="3" rowspan="2" 
                class="interno fixed-tlr" style="background-color:${headerSecondary}; color:white; text-align:center; vertical-align:middle; position:relative;
          font-weight: normal;line-height:1;">
            <button id="btnEsquema" title="Alterar cores" style="position:absolute;top:5px;left:5px;
            width: 30px;      /* nova largura */    
            height: 30px;     /* altura igual */
            padding: 0;       /* sem espaço interior */
            text-align:center;background:none;border:none;cursor:pointer;color: ${iconColor};transition: color .3s;">
            
            <svg aria-hidden="true"
               class="zap-logo"
                 viewBox="-2 -2 28 28"
              width="30" height="30"
              fill="currentColor"
            >
            <use href="icons.svg#zap-logo"></use>
            </svg>

            </button>

            <button id="btnToggleCorners" title="Alternar cantos">
            <span id="shapeToggle">${toggleIcon}</span>
            </button>

            <div style="font-weight: bold;margin-top: 15px;margin-bottom: 10px;">Potência contratada ${potenciaSelecionada}</div>
            <br>
            <div style="font-size: 14px;margin-bottom: -10px;">${strDiasSimples} dia${(typeof diasS === 'number' && diasS !== 1 ? 's' : '')}</div>
            <br>
            <div style="font-size: 14px;">
              OMIE = ${formatDecimal(OMIESSelecionadoS, 10, true)} €/kWh
                <span
                  class="omie-info-icon"
                  tabindex="0"
                  data-tippy-content="O preço OMIE oficial é divulgado em €/MWh (neste caso, ${omieMwhStr} €/MWh), mas aqui é apresentado em €/kWh para facilitar a comparação com os preços de energia na tabela."
                  style="cursor: help; margin-left: 4px;"
                ><svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
      focusable="false"
      style="vertical-align: middle;"
    >
      <circle cx="12" cy="12" r="10.5"/>
      <rect x="11.75" y="13" width=".5" height="3.5" rx="0" fill="currentColor"/>
      <circle cx="12" cy="8" r=".75" fill="currentColor"/>
    </svg></span>
            </div>            
            <span class="sort-container">
              <span class="sort-arrow0 ${sortField==='default' && sortDirection==='asc' ? 'selected' : ''}" onclick="setSort('default','asc')" title="Ordenar conforme a ordem no Excel">&#9650;</span>
              <span class="sort-arrow0 ${sortField==='default' && sortDirection==='desc' ? 'selected' : ''}" onclick="setSort('default','desc')" title="Ordenar conforme a ordem inversa no Excel">&#9660;</span>
            </span>
          </th>
          <th class="interno fixed-trr" style="background-color:${headerSecondary};color:white; text-align:center;">
            Consumo (kWh)
          </th>
        </tr>
        
        <tr>
          <td class="interno" style="background-color:${consumoBg}; font-weight:bold; color:black; text-align:center;">
            ${formatDecimal(consumo,4,trimZeros=true) || 0}
          </td>
        </tr>
        <tr>
          <th class="interno" style="background-color:${headerPrimary}; font-weight:bold; border-radius: 10px;color:${headerFtPrimary}; text-align:center; position:relative;">
            Tarifário
            <span class="sort-container">
              <span class="sort-arrow ${sortField==='tariff' && sortDirection==='asc' ? 'selected' : ''}" onclick="setSort('tariff','asc')" title="Ordenar alfabeticamente (A → Z)">&#9650;</span>
              <span class="sort-arrow ${sortField==='tariff' && sortDirection==='desc' ? 'selected' : ''}" onclick="setSort('tariff','desc')" title="Ordenar alfabeticamente (Z → A)">&#9660;</span>
            </span>
          </th>
          <th class="interno has-tooltip" data-tippy-content="Custo diário sem IVA" style="background-color:${headerPrimary}; font-weight:bold; border-radius: 10px;color:${headerFtPrimary}; text-align:center; position:relative;">
            Potência (€/dia)
            <span class="sort-container">
              <span class="sort-arrow ${sortField==='power' && sortDirection==='asc' ? 'selected' : ''}" onclick="event.stopPropagation();setSort('power','asc')" title="Ordenar do menor para o maior">&#9650;</span>
              <span class="sort-arrow ${sortField==='power' && sortDirection==='desc' ? 'selected' : ''}" onclick="event.stopPropagation();setSort('power','desc')" title="Ordenar do maior para o menor">&#9660;</span>
            </span>
          </th>
          <th class="interno has-tooltip" data-tippy-content="Custo por kWh sem IVA" style="background-color:${headerPrimary}; font-weight:bold; border-radius: 10px;color:${headerFtPrimary}; text-align:center; position:relative;">
            Energia (€/kWh)
            <span class="sort-container">
              <span class="sort-arrow ${sortField==='simple' && sortDirection==='asc' ? 'selected' : ''}" onclick="event.stopPropagation();setSort('simple','asc')" title="Ordenar do menor para o maior">&#9650;</span>
              <span class="sort-arrow ${sortField==='simple' && sortDirection==='desc' ? 'selected' : ''}" onclick="event.stopPropagation();setSort('simple','desc')" title="Ordenar do maior para o menor">&#9660;</span>
            </span>
          </th>
          <th class="interno has-tooltip" data-tippy-content="Preço final da fatura (com taxas e impostos)" style="background-color:${headerPrimary}; font-weight:bold; border-radius: 10px;color:${headerFtPrimary}; text-align:center; position:relative;">
            Preço (€)
            <span class="sort-container">
              <span class="sort-arrow ${sortField==='price' && sortDirection==='asc' ? 'selected' : ''}" onclick="event.stopPropagation();setSort('price','asc')" title="Ordenar do menor para o maior">&#9650;</span>
              <span class="sort-arrow ${sortField==='price' && sortDirection==='desc' ? 'selected' : ''}" onclick="event.stopPropagation();setSort('price','desc')" title="Ordenar do maior para o menor">&#9660;</span>
            </span>
          </th>
        </tr>`;
      



    
      tarifarios.forEach((tarifa, index) => {
        const corPotencia = calcularCor(tarifa.potencia, minPotencia, maxPotencia);
        const corSimples = calcularCor(tarifa.simples, minSimples, maxSimples);
        const corCusto = calcularCor(tarifa.custo, minCusto, maxCusto);

        const isMinPotencia = tarifa.potencia === minPotencia ? "font-weight:bold;" : "";
        const isMinSimples = tarifa.simples === minSimples ? "font-weight:bold;" : "";
        const isMinCusto = tarifa.custo === minCusto ? "font-weight:bold;" : "";

        // MODIFICAÇÃO 2: Se for "Meu tarifário" ou tarifário indexado, aplicar fundo amarelo
        // antes de entrar no tarifarios.forEach:
        const {
          quenteClaro,
          quenteEscuro,
          neutroClaro,
          neutroEscuro
        } = rowBgVariants[esquemaAtual] || rowBgVariants["azul-vermelho-claro"];

        let nomeStyle = "";

        const radius = cornersRounded ? "6px" : "0px";

        // Definir cor de fundo consoante indexado e paridade da linha
        const isPar = index % 2 === 1;

        if (tarifa.isIndexado) {
          nomeStyle += `background-color: ${isPar ? quenteClaro : quenteEscuro};`;

          // Cor do texto especial para alguns nomes
          if (
            tarifa.nome === "Repsol indexado" || tarifa.nome === "Coopérnico" ||
            tarifa.nome === "Plenitude indexado" || tarifa.nome === "Coopérnico: Base 2.0" ||
            tarifa.nome === "Repsol: Tarifa Leve Sem Mais" || tarifa.nome === "Plenitude: Tarifa Tendência"
          ) {
            nomeStyle += "color: #005FA8;";
          } else {
            nomeStyle += "color: black;";
          }

        } else {
          nomeStyle += `background-color: ${isPar ? neutroClaro : neutroEscuro};`;
          nomeStyle += "color: black;";
        }


            if (tarifa.nome === "Meu tarifário") {
              nomeStyle = nomeStyles[esquemaAtual] || nomeStyles["azul-vermelho"]; // fallback caso necessário
            }
            nomeStyle += `border-radius:${radius};`;

    

            // Apenas para “EDP indexado” criamos a tooltipText e a classe
            let cellAttrs = ' class="internop"';
            if ((tarifa.nome === "EDP indexado" || tarifa.nome.startsWith("EDP: Eletricidade Indexada")) && incluirEDP && potenciaNum >=3.45) {
                const descontoMsg = `Valor apresentado inclui desconto mensal de 10€ válido nos primeiros 10 meses, para adesões até 30/9/${CURRENT_YEAR}`;
                const tooltipText = descontoMsg;
                cellAttrs = ` class="internop has-tooltip mais-indicator" data-tippy-content="${tooltipText}"`;        
            }
            if ((tarifa.nome === "Galp Continente" || tarifa.nome.startsWith("Galp: Plano Galp")) && incluirContinente) {
                const descontoMsg = "Valor apresentado assume desconto de 10% na potência e energia em Cartão Continente";
                const tooltipText = descontoMsg;
                cellAttrs = ` class="internop has-tooltip mais-indicator" data-tippy-content="${tooltipText}"`;        
            }
            if (tarifa.nome.startsWith("Meo") && incluirMeo) {
                const descontoMsg = "Valor apresentado inclui desconto de 0.01€ na energia válido para clientes Meo";
                const tooltipText = descontoMsg;
                cellAttrs = ` class="internop has-tooltip mais-indicator" data-tippy-content="${tooltipText}"`;  
            }
            if ((tarifa.nome === "Goldenergy ACP" || tarifa.nome.startsWith("Goldenergy: Tarifário Parceria ACP")) && !incluirACP) {
                const descontoMsg = "Valor apresentado não inclui quota mensal ACP de 4.80€";
                const tooltipText = descontoMsg;
                cellAttrs = ` class="internop has-tooltip mais-indicator" data-tippy-content="${tooltipText}"`;  
            }
            

            

            // decide se sinalizamos este tarifário “Meo”

            // 1) Prepara o HTML do tooltip “matriz” só para a célula de Potência
            // 1) Monta o HTML da tabela com <thead>, <tbody> e <tfoot>

            // antes de montar o tooltip:
            const descontoRow = tsFlag === 1
                ? `<tr>
     <td>Desconto da tarifa social</td>
     <td style="padding-left:6px;">- ${formatDecimal(descontoPotTS,4)}</td>
   </tr>`
                : ``;   
                
            // dentro do teu loop, logo antes de montar o potenciaTooltip:
            let feeRow = '';
            let dias =1;
            let luzigasFee1 = 0;
            if (tarifa.nome.startsWith("Luzigás Energy 8.8") && diasS!==0) {
                // decides quantos dias usar
                let diasLabel;
                if (DataS) {
                    dias *= 365 /12
                    diasLabel = `(365/12) dias`;
                } else {
                    dias *= diasS;
                    diasLabel = `${diasS} dia${diasS === 1 ? '' : 's'}`;
                }
                luzigasFee1 += parseFloat((luzigasFee0/dias).toFixed(4));
                feeRow = `
    <tr>
      <td>Fee ${formatDecimal(luzigasFee0,2)}  € / ${diasLabel}</td>
      <td style="padding-left:6px; text-align:right;">
        ${formatDecimal(luzigasFee1,4)}
      </td>
    </tr>
  `;
            }

            let valor = tarifa.potencia
                - tarPotSnum
                + tsFlag * descontoPotTS
                - luzigasFee1;

            let str = formatDecimal(valor, 4);
            if (str === "-0,0000") {
                str = "0,0000";
            }



            const potenciaTooltip = `
<table class="tooltip-matrix">
  <thead>
    <tr>
      <th style="background-color: ${headerPrimary}; color: ${headerFtPrimary};"> Designação</th>
      <th style="background-color: ${headerPrimary}; color: ${headerFtPrimary};">Preço s/ IVA (€/dia)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Potência (comercializador) - ${potenciaSelecionada}</td>
      <td>${str}</td>
    </tr>
    <tr>
      <td>Potência (acesso às redes) - ${potenciaSelecionada}</td>
      <td>${formatDecimal(tarPotSnum, 4)}</td>
    </tr>
    ${descontoRow}
    ${feeRow}
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>${formatDecimal(tarifa.potencia, 4)}</td>
    </tr>
  </tfoot>
</table>
`.trim().replace(/\n\s*/g, '');

            // 1) Constroi a string HTML do tooltip de Energia
            const energiaTooltip = `
<table class="tooltip-matrix">
  <thead>
    <tr>
      <th style="background-color: ${headerPrimary}; color: ${headerFtPrimary};">Designação</th>
      <th style="background-color: ${headerPrimary}; color: ${headerFtPrimary};">Preço s/ IVA (€/kWh)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Energia (comercializador)</td>
      <td style="text-align:right;">${formatDecimal(tarifa.simples-TARSimplesS+tsFlag*descontoKwhTS, 4)}</td>
    </tr>
    <tr>
      <td>Energia (acesso às redes)</td>
      <td style="text-align:right;">${formatDecimal(TARSimplesS, 4)}</td>
    </tr>
    ${ tsFlag === 1 
      ? `<tr>
           <td>Desconto da tarifa social</td>
           <td style="text-align:right;">- ${formatDecimal(descontoKwhTS, 4)}</td>
         </tr>` 
      : `` }
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td style="text-align:right;">${formatDecimal(tarifa.simples,4)}</td>
    </tr>
  </tfoot>
</table>
`.trim().replace(/\n\s*/g, '');


// 1) Nomes e flags
const nomePotBase     = `Potência – ${potenciaSelecionada}`;
const nomePotRedes    = `Potência – ${potenciaSelecionada}`;
const temParcelaRedes = potenciaNum <= 3.45;

// 2) Potência (redes) com desconto TS
// usa exatamente a tua fórmula: tarPotSnum - tsFlag * descontoPotTS
const tarPotBp       = tarPotSnum - tsFlag * descontoPotTS;
const valorPotRedes  = tarPotBp * diasS;

// 3) Potência (comercializador)
const precoBase      = tarifa.potencia - (temParcelaRedes ? tarPotBp : 0);
const valorPotBase   = precoBase * diasS;

// 4) Linhas de potência
const linhasPotencia = [{
  nome: nomePotBase,
  quantidade: `${diasS} dia${diasS>1?'s':''}`,
  preco: precoBase.toFixed(4).replace('.',','),
  valor: valorPotBase.toFixed(2).replace('.',','),
  ivaPct: "23"
}];
if (temParcelaRedes) {
  linhasPotencia.push({
    nome: nomePotRedes,
    quantidade: `${diasS} dia${diasS>1?'s':''}`,
    preco: tarPotBp.toFixed(4).replace('.',','),
    valor: valorPotRedes.toFixed(2).replace('.',','),
    ivaPct: "6"
  });
}


// 5) Energia
const energia6kWh   = potenciaNum <= 6.9 ? Math.min(consumo, kWhIVAPromocionalS) : 0;
const energia23kWh  = consumo - energia6kWh;
const valorEnergia6  = energia6kWh  * tarifa.simples;
const valorEnergia23 = energia23kWh * tarifa.simples;

// 6) Linhas de energia
const linhasEnergia = [];
if (energia23kWh > 0) linhasEnergia.push({
  nome: "Consumo Simples",
  quantidade: `${energia23kWh} kWh`,
  preco: tarifa.simples.toFixed(4).replace('.',','),
  valor: valorEnergia23.toFixed(2).replace('.',','),
  ivaPct: "23"
});
if (energia6kWh > 0) linhasEnergia.push({
  nome: "Consumo Simples",
  quantidade: `${energia6kWh} kWh`,
  preco: tarifa.simples.toFixed(4).replace('.',','),
  valor: valorEnergia6.toFixed(2).replace('.',','),
  ivaPct: "6"
});


// 7) Total Eletricidade — soma de cada parcela já arredondada a 2 casas
const potBase2    = parseFloat(valorPotBase.toFixed(2));
const potRedes2   = parseFloat((temParcelaRedes ? valorPotRedes : 0).toFixed(2));
const ene23_2     = parseFloat(valorEnergia23.toFixed(2));
const ene6_2      = parseFloat(valorEnergia6.toFixed(2));

const totalElecNum = potBase2 + potRedes2 + ene23_2 + ene6_2;

const totalEletricidade    = totalElecNum.toFixed(2).replace('.',',');
const totalEletricidadeNum = totalElecNum;


// 8) Taxas & Outros (sem IVA)
const taxItems = [];
// Taxa DGEG
taxItems.push({
  nome: "Taxa DGEG",
  quantidade: "1 mês",
  preco: DGEGS.toFixed(2).replace('.',','),
  valor: DGEGS.toFixed(2).replace('.',','),
  ivaPct: "23"
});
// IEC
taxItems.push({
  nome: "IEC",
  quantidade: `${consumo} kWh`,
  preco: IESS.toFixed(3).replace('.',','),
  valor: (IESS * consumo).toFixed(2).replace('.',','),
  ivaPct: "23"
});
// Contribuição Audiovisual
taxItems.push({
  nome: "Cont. Audiovisual",
  quantidade: "1 mês",
  preco: AudiovisualS.toFixed(2).replace('.',','),
  valor: AudiovisualS.toFixed(2).replace('.',','),
  ivaPct: "6"
});

// Encargo Tarifa Social (somente por nome, sem tsFlag)
let enc23 = 0, enc6 = 0;
if (aplicaEncargoTS(tarifa.nome)) {
  if (tarifa.nome.startsWith("Goldenergy")) {
    enc23 = consumo * FTSS;
  } else {
    enc23 = energia23kWh * FTSS;
    enc6  = energia6kWh  * FTSS;
  }
}
if (enc23 > 0) taxItems.push({
  nome: "Enc. tarifa social",
  quantidade: `${tarifa.nome.startsWith("Goldenergy") ? consumo : energia23kWh} kWh`,
  preco: FTSS.toFixed(6).replace('.',','),
  valor: enc23.toFixed(2).replace('.',','),
  ivaPct: "23"
});
if (enc6 > 0) taxItems.push({
  nome: "Enc. tarifa social",
  quantidade: `${energia6kWh} kWh`,
  preco: FTSS.toFixed(6).replace('.',','),
  valor: enc6.toFixed(2).replace('.',','),
  ivaPct: "6"
});

//  X) Se for EDP indexado e incluído, acrescenta desconto de 10€
if (
  (tarifa.nome === "EDP indexado" 
    || tarifa.nome.startsWith("EDP: Eletricidade Indexada")) 
  && incluirEDP 
  && potenciaNum >= 3.45
) {
  const descontoEDP = 10;
  taxItems.push({
    nome: "Desconto EDP (10€)",
    quantidade: "1 mês",
    preco: `-${descontoEDP.toFixed(2).replace('.', ',')}`,
    valor: `-${descontoEDP.toFixed(2).replace('.', ',')}`,
    ivaPct: ""  // sem IVA
  });
}



// 9) Totais de Taxas & Outros
const totalOtherNum = taxItems.reduce((s,t)=> s + parseFloat(t.valor.replace(',','.')), 0);

const totalOther    = totalOtherNum.toFixed(2).replace('.',',');

// 10) Valor sem IVA
const totalSemIVANum = totalEletricidadeNum + totalOtherNum;
const totalSemIVA    = totalSemIVANum.toFixed(2).replace('.',',');

// 11) Bases de IVA agrupadas
const base23 = [
  ...linhasPotencia.filter(l=>l.ivaPct==="23"),
  ...linhasEnergia.filter(l=>l.ivaPct==="23"),
  ...taxItems.filter(t=>t.ivaPct==="23")
].reduce((s,x)=> s + parseFloat(x.valor.replace(',','.')), 0);

const base6 = [
  ...linhasPotencia.filter(l=>l.ivaPct==="6"),
  ...linhasEnergia.filter(l=>l.ivaPct==="6"),
  ...taxItems.filter(t=>t.ivaPct==="6")
].reduce((s,x)=> s + parseFloat(x.valor.replace(',','.')), 0);

const base23Str = base23.toFixed(2).replace('.',',');
const base6Str  = base6.toFixed(2).replace('.',',');


// 12) Calcula IVA agrupado
const iva23    = base23 * 0.23;
const iva6     = base6  * 0.06;
const iva23Str = iva23.toFixed(2).replace('.',',');
const iva6Str  = iva6.toFixed(2).replace('.',',');
// Arredonda cada IVA a 2 casas
const iva23Rounded = parseFloat(iva23.toFixed(2));
const iva6Rounded  = parseFloat(iva6.toFixed(2));


// 13) Total com IVA
const totalComIVANum = totalSemIVANum + iva23Rounded + iva6Rounded;
const totalComIVA    = totalComIVANum.toFixed(2).replace('.',',');

// 14) Tooltip plano
const invoiceTooltip = `
<div class="tooltip-invoice">
  <table class="tooltip-matrix">
    <thead>
      <tr>
        <th style="white-space: nowrap; background-color: ${headerPrimary}; color: ${headerFtPrimary};">Designação</th>
        <th style="white-space: nowrap; background-color: ${headerPrimary}; color: ${headerFtPrimary};">Quantidade</th>
        <th style="white-space: nowrap; background-color: ${headerPrimary}; color: ${headerFtPrimary};">Preço (€)</th>
        <th style="white-space: nowrap; background-color: ${headerPrimary}; color: ${headerFtPrimary};">Valor (€)</th>
        <th style="white-space: nowrap; background-color: ${headerPrimary}; color: ${headerFtPrimary};">IVA</th>
      </tr>
    </thead>
        <tbody>
      ${[...linhasPotencia, ...linhasEnergia].map(l => `
        <tr>
          <td>${l.nome}</td><td>${l.quantidade}</td>
          <td>${l.preco}</td><td>${l.valor}</td>
          <td>${l.ivaPct ? l.ivaPct+'%' : ''}</td>
        </tr>
      `).join('')}
      <tr class="total">
        <td colspan="3"><strong>Eletricidade</strong></td>
        <td><strong>${totalEletricidade}</strong></td>
      </tr>
      ${taxItems.map(t => `
        <tr>
          <td>${t.nome}</td><td>${t.quantidade}</td>
          <td>${t.preco}</td><td>${t.valor}</td>
          <td>${t.ivaPct ? t.ivaPct+'%' : ''}</td>
        </tr>
      `).join('')}
      <tr class="total">
        <td colspan="3"><strong>Taxas e Outros</strong></td>
        <td><strong>${totalOther}</strong></td>
      </tr>
      <tr class="separator"><td colspan="5"></td></tr>
      <tr>
        <td colspan="3"><strong>Valor sem IVA</strong></td>
        <td><strong>${totalSemIVA}</strong></td>
      </tr>
      <tr>
        <td>IVA (23%)</td><td>${base23Str} €</td><td colspan="2">${iva23Str}</td><td></td>
      </tr>
      <tr>
        <td>IVA (6%)</td><td>${base6Str} €</td><td colspan="2">${iva6Str}</td><td></td>
      </tr>
      <tr class="total">
        <td colspan="3"><strong>Valor com IVA</strong></td>
        <td><strong>${totalComIVA}</strong></td><td></td>
      </tr>
    </tbody>
  </table>
</div>
`.trim().replace(/'/g,"&apos;");



           
            // 2) Agora injeta no <td> da Potência:
            tabelaResultados += `<tr>
<td ${cellAttrs} style='${nomeStyle}'>${tarifa.nome}</td>

<td
  class="has-tooltip internop"
  data-tippy-content='${potenciaTooltip}'
  style='${isMinPotencia} background-color:${corPotencia}; color:black; border-radius: ${radius};'
>
  ${formatDecimal(tarifa.potencia,4)}
</td>

<td
    class="has-tooltip internop"
    data-tippy-content='${energiaTooltip}' 
    style='${isMinSimples} background-color:${corSimples}; color:black; border-radius: ${radius};'>
  ${formatDecimal(tarifa.simples,4)}
</td>

<td class="has-tooltip internop"
    data-tippy-content='${invoiceTooltip}'
    style='${isMinCusto} background-color:${corCusto}; color:black; border-radius: ${radius};'>
  ${formatDecimal(tarifa.custo,2)}
</td>
</tr>`;
});
    
        tabelaResultados += "</table>";


        document.getElementById("resultado").innerHTML = tabelaResultados;
        // Agora que a tabela foi desenhada, o botão já existe — associar o evento!
        document.getElementById("btnEsquema")?.addEventListener("click", () => {
          // 1) avança esquema
          indiceEsquema = (indiceEsquema + 1) % esquemas.length;
          esquemaAtual = esquemas[indiceEsquema];

          // 2) atualiza o ícone
          const icone = document.getElementById("iconeRaio");
          if (icone) {
            icone.style.color = coresIcone[esquemaAtual];
            icone.classList.add("pulsar");
            setTimeout(() => icone.classList.remove("pulsar"), 600);
          }

          


            // inverte o esquema
            // esquemaAtual = (esquemaAtual === "azul-vermelho")
            //    ? "azul-creme-vermelho"
            //    : "azul-vermelho";

            // atualiza o ícone
            // const icone = document.getElementById("iconeRaio");
            // if (icone) {
            //    icone.style.color = esquemaAtual === "azul-vermelho" ? "#FFFFFF" : "#FFF6E5";
            //    icone.classList.add("pulsar");
            //    setTimeout(() => icone.classList.remove("pulsar"), 600);
            //}

            // **NOVO**: troca também as cores do select de potência e do input de consumo
            

            // 3) atualiza select de potência
          const pot = document.getElementById("potenciac");
          if (pot) {
            const { bg, color } = potStyles[esquemaAtual];
            pot.style.backgroundColor = bg;
            pot.style.color = color;
          }

          // 4) atualiza input de consumo
          const con = document.getElementById("consumoInput");
          if (con) {
            const { bg, color } = conStyles[esquemaAtual];
            con.style.backgroundColor = bg;
            con.style.color = color;
          }
            //if (esquemaAtual === "azul-creme-vermelho") {
            //    pot.style.backgroundColor = "#007A1E";  // azul escuro
            //    pot.style.color = "#FFFFFF";
            //    con.style.backgroundColor = "#F0B000";  // creme
            //    con.style.color = "#000000";
            //} else {
            //    pot.style.backgroundColor = "#375623";  // verde original
            //    pot.style.color = "#FFFFFF";
            //    con.style.backgroundColor = "#FFC000";  // amarelo original
            //    con.style.color = "#000000";
            //}

            // finalmente, redesenha tudo com o novo esquema de heat-map
            
            atualizarResultados();
            
        });
        
        // —— AQUI ——
        document.getElementById("btnToggleCorners")?.addEventListener("click", () => {
          // 1) alterna variável de estado
          cornersRounded = !cornersRounded;
          
          // 2) troca o conteúdo do span entre ■ e ●
          document.getElementById("shapeToggle").textContent =
            cornersRounded ? "\u25A1" : "\u25CB";
        
          // 3) adiciona/remove a classe que zera o border-radius (se estiver usando CSS)
          document.body.classList.toggle("no-rounded", !cornersRounded);


          // começo: aplica border-radius geral
    

          // 5) (opcional) redesenha resultados se realmente precisar
          // atualizarResultados();
        });


        

    };
}

// --------------------------------------------------
// 1) Funções utilitárias (suas definições anteriores seguem intactas: parseEuro, parsePercent, 
// converterReferencia, obterTabela, obterVariavel, carregarDadosCSV, preencherSelecaoMeses, atualizarResultados, calcularPreco, alternarAba, atualizarEstadoDatas)


// --------------------------------------------------
// 2) Aplica o esquema de cores ao select de potência e input de consumo
function aplicarEsquema(esquema) {
  const pot = document.getElementById("potenciac");
  const con = document.getElementById("consumoInput");
  if (!pot || !con) return;

  // adicione aqui o terceiro tema
  const temas = {
      "azul-vermelho-claro": {
          potBg: "#375623",  // ou outra cor que você prefira
          potFg: "#FFFFFF",
          conBg: "#FFC000",  // amarelo suave
          conFg: "#000000"
      },
      "azul-vermelho": {
          potBg: "#375623",
          potFg: "#FFFFFF",
          conBg: "#FFC000",
          conFg: "#000000"
      },
      "azul-creme-vermelho": {
          potBg: "#007A1E",
          potFg: "#FFFFFF",
          conBg: "#FFF6E5",
          conFg: "#000000"
      }
  }[esquema] || {
      // fallback genérico, caso esquema venha inválido
      potBg: "#375623", potFg: "#FFFFFF",
      conBg: "#FFC000", conFg: "#000000"
  };

  pot.style.backgroundColor = temas.potBg;
  pot.style.color           = temas.potFg;
  con.style.backgroundColor = temas.conBg;
  con.style.color           = temas.conFg;
}



// --------------------------------------------------
// 3) Cria listener de toggle entre painéis
function criarToggle(botao, painelMostrar, paineisOcultar = []) {
    botao.addEventListener("click", () => {
        const abrir = painelMostrar.classList.contains("hidden");
        // oculta todos
        paineisOcultar.concat(painelMostrar).forEach(p =>
            p.classList.toggle("hidden", !abrir || p !== painelMostrar)
        );
        atualizarResultados();
    });
}


// --------------------------------------------------
// 4) Reset dos descontos sociais
function resetDescontosSociais() {
    document.querySelector('input[name="tsType"][value="none"]').checked = true;
    document.getElementById("familiasNumerosas").checked = false;
}




// --------------------------------------------------
// 5) Agrupar listeners “simples” de atualização
[
  { id: "mesSelecionado",    evt: "change" },
  { id: "dias",             evt: "input" },
  { id: "consumoInput",          evt: "input" },
  { id: "potenciac",        evt: "change" },
  { id: "fixo",             evt: "input" },
  { id: "variavel",         evt: "input" },
  { id: "omieInput",         evt: "input" },
  { id: "mostrarNomes",     evt: "change" },
  { id: "incluirACP",       evt: "change" },
  { id: "incluirContinente",evt: "change" },
  { id: "incluirMeo",       evt: "change" },
  { id: "restringir",       evt: "change" },
  { id: "incluirEDP",       evt: "change" },
].forEach(({ id, evt }) => {
  document.getElementById(id)
    ?.addEventListener(evt, atualizarResultados);
});

document.querySelectorAll('input[name="tsType"]').forEach(r =>
    r.addEventListener("change", atualizarResultados)
);
document.getElementById("familiasNumerosas")
    ?.addEventListener("change", atualizarResultados);

  

function alternarAba(abaSelecionada) {
    const abas = ["MeuTarifario", "OutrasOpcoes"];

    abas.forEach(aba => {
        document.getElementById("aba" + aba).classList.toggle("ativa", aba === abaSelecionada);
        document.getElementById("conteudo" + aba).classList.toggle("ativa", aba === abaSelecionada);
    });
}

function revealPostTableContent() {
    const wrapper = document.getElementById('postTableContent');
    // 1) mostra o container todo de uma vez
    wrapper.style.visibility = 'visible';
  
    // 2) garante que o iframe só carrega quando vamos revelar
    const iframe = document.getElementById('grafico');
    if (!iframe.src) iframe.src = iframe.dataset.src;
  
    // 3) adiciona a classe 'visible' a todos os .reveal simultaneamente
    wrapper.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

// --------------------------------------------------
// 6) Toda inicialização em um só lugar
document.addEventListener("DOMContentLoaded", async () => {
  // ============================================================
  // DYNAMIC YEAR INITIALIZATION
  // ============================================================
  
  // Set dynamic year in title and copyright
  const yearDisplay = document.getElementById("yearDisplay");
  const copyrightYear = document.getElementById("copyrightYear");
  if (yearDisplay) yearDisplay.textContent = CURRENT_YEAR;
  if (copyrightYear) copyrightYear.textContent = CURRENT_YEAR;
  
  // Update page title with year
  document.title = `Comparador de Tarifários ${CURRENT_YEAR}`;
  
  // Set date input constraints dynamically
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  if (startDateInput) {
    startDateInput.min = DATE_MIN;
    startDateInput.max = DATE_MAX;
  }
  if (endDateInput) {
    endDateInput.min = DATE_MIN;
    endDateInput.max = DATE_MAX;
  }
  
  // ============================================================
  // REFERENCES
  // ============================================================
  
  // referências principais
  const btnDias         = document.getElementById("btnDias");
  const div3            = document.querySelector(".div3");
  const div4            = document.querySelector(".div4");
  const div5            = document.querySelector(".div5");
  const div6            = document.querySelector(".div6");
  const btnShowOmie     = document.getElementById("btnShowOmie");
  const btnShowCalendar = document.getElementById("btnShowCalendar");
  const btnShowTs       = document.getElementById("btnShowTs");
  const btnClearOmie    = document.getElementById("btnClearOmie");
  const btnClearDates   = document.getElementById("btnClearDates");
  const btnClearTs      = document.getElementById("btnClearTs");
  const btnClearAll     = document.getElementById("btnClearForms");
  const btnDef          = document.getElementById("btnDefinicoes");
  const secaoDef        = document.getElementById(btnDef.dataset.target);
  const arrowUseDef        = btnDef.querySelector("use");
  const arrowUseDias    = btnDias.querySelector("use");
  const startDate       = document.getElementById("startDate");
  const endDate         = document.getElementById("endDate");
  const mesSelecionado  = document.getElementById("mesSelecionado");
  const diasInput       = document.getElementById("dias");

  const omieInput = document.getElementById("omieInput");
// onst upBtn     = document.getElementById("upBtn");
// const downBtn   = document.getElementById("downBtn");


  // imediatamente depois de carregar o DOM:
// 2.1) Referência ao <input>

// const REPEAT_INTERVAL = 25;  // ms entre incrementos ao manter pressionado
let REPEAT_INTERVAL = DataS ? 5 : 25;  // ms entre incrementos ao manter pressionado

const INITIAL_DELAY   = 200; // ms até começar o auto-repeat

// Seleciona todos os containers .spinner-wrapper
const wrappers = document.querySelectorAll(".spinner-wrapper");

wrappers.forEach(wrapper => {
  // Dentro do .spinner-wrapper, busque o <input type="number">
  const input = wrapper.querySelector('input[type="number"]');
  // Botões de incremento/decremento dentro do mesmo wrapper
  const btnUp   = wrapper.querySelector(".spinner-up");
  const btnDown = wrapper.querySelector(".spinner-down");

  // Estado interno DE CADA spinner (isolado por wrapper)
  let ultimoValidoNum = parseFloat(input.value) || 0;
  let ignoreInput = false;
  let debounceTimeout;
  let repeatTimeoutId = null;
  let repeatIntervalId = null;
  let keyDownActive = false;

  // 2.1) Função que ajusta o valor do input em ±step
  function ajustarValor(delta) {
    let atualNum;
  
    // 1) Se for OMIE e vazio, usar OMIESSelecionadoS*1000 (como já estava)
    if (input.id === "omieInput" && input.value.trim() === "") {
      atualNum = Number((OMIESSelecionadoS * 1000).toFixed(2));
    }
    // 2) Se for “dias” e vazio, buscar o valor padrão da tabela de dias do mês
    else if (input.id === "dias" && input.value.trim() === "") {
      // 2.1) Obtenha o índice do mês selecionado
      const mesIndice = document.getElementById("mesSelecionado").selectedIndex;
      // 2.2) Recrie rapidamente a mesma extração que você faz em atualizarResultados():
      //       pegar a tabela “diasMeses” (já carregada no CSV básico) e “achatar” em array
      const diasMesesBruto = obterTabela("diasMeses")?.flat() || [];
      // 2.3) Caso esse array exista, converter a string para número:
      const padrao = parseFloat(String(diasMesesBruto[mesIndice]).replace(",", ".")) || 0;
      atualNum = padrao;
    }
    // 3) Se for qualquer outro campo (ou dias NÃO vazio), partir do último válido
    else {
      atualNum = isNaN(ultimoValidoNum) ? 0 : ultimoValidoNum;
    }
  
    // 4) Aplicar o passo normalmente
    const passo = parseFloat(input.step) || 1;
    let novoNum = atualNum + delta * passo;
  
    // 5) Validar min/max (se existir)
    if (input.min !== undefined && input.min !== "") {
      const minValor = parseFloat(input.min);
      if (!isNaN(minValor) && novoNum < minValor) {
        novoNum = minValor;
      }
    }
    if (input.max !== undefined && input.max !== "") {
      const maxValor = parseFloat(input.max);
      if (!isNaN(maxValor) && novoNum > maxValor) {
        novoNum = maxValor;
      }
    }
  
    // 6) Corrigir ponto flutuante e arredondar (até 10 casas, por exemplo)
    novoNum = Number(novoNum.toFixed(10));
  
    // 7) Atualizar o input sem disparar listener de “input”
    ignoreInput = true;
    input.valueAsNumber = novoNum;
    ignoreInput = false;
  
    // 8) Salvar como “último válido”
    ultimoValidoNum = novoNum;
  
    // 9) Disparar atualizarResultados() com debounce
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (typeof atualizarResultados === "function") {
        atualizarResultados();
      }
    }, 0);
  }
  

  // 2.2) Limpa timeouts/intervals de repetição
  function limparRepeticao() {
    keyDownActive = false;
    if (repeatTimeoutId !== null) {
      clearTimeout(repeatTimeoutId);
      repeatTimeoutId = null;
    }
    if (repeatIntervalId !== null) {
      clearInterval(repeatIntervalId);
      repeatIntervalId = null;
    }
  }

  // 2.3) Listeners de teclado (setas ↑/↓) no INPUT
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // Impede o incremento nativo do browser
      if (!keyDownActive) {
        keyDownActive = true;
        const delta = (e.key === "ArrowUp") ? 1 : -1;
        ajustarValor(delta);
        // Inicia auto-repeat após INITIAL_DELAY
        repeatTimeoutId = setTimeout(() => {
          repeatIntervalId = setInterval(() => ajustarValor(delta), REPEAT_INTERVAL);
        }, INITIAL_DELAY);
      }
    }
  });
  input.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      limparRepeticao();
    }
  });
  input.addEventListener("blur", limparRepeticao);

  // 2.4) Listener “input” (edição manual)
  input.addEventListener("input", function() {
    if (ignoreInput) return;
    // Normaliza vírgula → ponto, se precisar
    const tentativa = this.value.replace(",", ".");
    const x = parseFloat(tentativa);

    if (tentativa === "") {
      // Se apagar tudo, mantemos ultimoValidoNum como estava
      return;
    }
    // Se for número e respeitar limites (min/max), atualiza; senão, restaura
    if (!isNaN(x)) {
      // Validação mínima, se tiver input.min
      if (input.min !== undefined && input.min !== "") {
        const minValor = parseFloat(input.min);
        if (!isNaN(minValor) && x < minValor) {
          this.value = ultimoValidoNum;
          return;
        }
      }
      // Validação máxima, se tiver input.max
      if (input.max !== undefined && input.max !== "") {
        const maxValor = parseFloat(input.max);
        if (!isNaN(maxValor) && x > maxValor) {
          this.value = ultimoValidoNum;
          return;
        }
      }
      // Se passou nas validações, atualiza último
      ultimoValidoNum = x;
    } else {
      // Invalido: restaura
      this.value = ultimoValidoNum;
    }
    // Chama atualizarResultados()
    if (typeof atualizarResultados === "function") {
      atualizarResultados();
    }
  });

  // 2.5) Listeners para clicar/segurar nos botões ▲ e ▼
  // ▲
  btnUp.addEventListener("mousedown", () => {
    ajustarValor(1);
    repeatTimeoutId = setTimeout(() => {
      repeatIntervalId = setInterval(() => ajustarValor(1), REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  });
  btnUp.addEventListener("touchstart", () => {
    ajustarValor(1);
    repeatTimeoutId = setTimeout(() => {
      repeatIntervalId = setInterval(() => ajustarValor(1), REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  });
  btnUp.addEventListener("mouseup", limparRepeticao);
  btnUp.addEventListener("mouseleave", limparRepeticao);
  btnUp.addEventListener("touchend", limparRepeticao);

  // ▼
  btnDown.addEventListener("mousedown", () => {
    ajustarValor(-1);
    repeatTimeoutId = setTimeout(() => {
      repeatIntervalId = setInterval(() => ajustarValor(-1), REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  });
  btnDown.addEventListener("touchstart", () => {
    ajustarValor(-1);
    repeatTimeoutId = setTimeout(() => {
      repeatIntervalId = setInterval(() => ajustarValor(-1), REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  });
  btnDown.addEventListener("mouseup", limparRepeticao);
  btnDown.addEventListener("mouseleave", limparRepeticao);
  btnDown.addEventListener("touchend", limparRepeticao);
});








  



  


  // Controle de "DataS": desativa mês+dias se houver intervalo válido
  function atualizarEstadoDatas() {
      const inicioValido = startDate.value !== "";
      const fimValido    = endDate.value   !== "";
      DataS = inicioValido && fimValido && (startDate.value <= endDate.value);
  
      mesSelecionado.disabled = DataS;
      diasInput.disabled      = DataS;
      // 3️⃣ REAJUSTA O INTERVALO sempre que DataS mudar
  REPEAT_INTERVAL = DataS ? 5 : 25;
  debugLog(`🔄 REPEAT_INTERVAL agora é ${REPEAT_INTERVAL} ms (DataS = ${DataS})`);
    }

  // estado para o botão Dias
  let estadoOmieAberto = false,
      estadoCalendarioAberto = false,
      estadoTsAberto = false;

  // 1) Carregar CSV, aplicar esquema e popular meses
  debugLog("🔄 Iniciando carregamento do CSV...");
  dadosCSV_basico = await carregarCSV(urlCSV_basico);
  
  // Check if data loaded successfully
  if (dadosCSV_basico.length === 0) {
    debugLog("❌ Falha ao carregar dados básicos");
    // Show error but continue - allow app to render
  } else {
    debugLog("✅ CSV básico carregado");
    hideDataError();
    updateDataFreshnessIndicator();
  }
  
  aplicarEsquema(esquemaAtual);
  preencherSelecaoMeses();
  document.getElementById("incluirACP").checked = false;
  document.getElementById("incluirEDP").checked = true;
  document.getElementById("incluirMeo").checked = true;
  document.getElementById("incluirContinente").checked = true;
  document.body.classList.toggle("no-rounded", !cornersRounded);


  atualizarResultados();
  revealPostTableContent();

  // 2) Listeners de Clear individuais
  btnClearAll.addEventListener("click", () => {
      document.getElementById("omieInput").value = "";
      startDate.value = endDate.value = "";
      // 2) Restaura os limites originais
      startDate.min = DATE_MIN;
      startDate.max = DATE_MAX;
      endDate.min = DATE_MIN;
      endDate.max = DATE_MAX;
      resetDescontosSociais();
      atualizarEstadoDatas();
      atualizarResultados();
  });
  btnClearOmie.addEventListener("click", () => {
      document.getElementById("omieInput").value = "";
      atualizarResultados();
  });
  btnClearDates.addEventListener("click", () => {
      startDate.value = endDate.value = "";
      // 2) Restaura os limites originais
      startDate.min = DATE_MIN;
      startDate.max = DATE_MAX;
      endDate.min = DATE_MIN;
      endDate.max = DATE_MAX;
      atualizarEstadoDatas();
      atualizarResultados();
  });
  btnClearTs.addEventListener("click", () => {
      resetDescontosSociais();
      atualizarResultados();
  });

  // 3) Toggle OMIE + clear
  btnShowOmie.addEventListener("click", () => {
      div4.classList.toggle("hidden");
      // esconde Datas e TS e limpa as Datas sempre que OMIE aparece
      if (!div4.classList.contains("hidden")) {
          div5.classList.add("hidden");
          startDate.value = "";
          endDate.value = "";
          btnClearDates.classList.add("hidden");
          div6.classList.add("hidden");
          btnClearTs.classList.add("hidden");
      }
      // mostra/esconde o botão “limpar OMIE”
      btnClearOmie.classList.toggle("hidden", div4.classList.contains("hidden"));
      atualizarResultados();
  });
  // 4) Toggle Datas + clear
  btnShowCalendar.addEventListener("click", () => {
      div5.classList.toggle("hidden");
      // esconde OMIE e TS e limpa OMIE sempre que Datas aparecem
      if (!div5.classList.contains("hidden")) {
          div4.classList.add("hidden");
          document.getElementById("omieInput").value = "";
          btnClearOmie.classList.add("hidden");
          div6.classList.add("hidden");
          btnClearTs.classList.add("hidden");
      }
      btnClearDates.classList.toggle("hidden", div5.classList.contains("hidden"));
      atualizarResultados();
  });
  // 5) Toggle TS + clear
  btnShowTs.addEventListener("click", () => {
      div6.classList.toggle("hidden");
      if (!div6.classList.contains("hidden")) {
          div4.classList.add("hidden");
          btnClearOmie.classList.add("hidden");
          div5.classList.add("hidden");
          btnClearDates.classList.add("hidden");
      }
      btnClearTs.classList.toggle("hidden", div6.classList.contains("hidden"));
      atualizarResultados();
  });

  // 6) Botão Definições
  // espera que o DOM esteja pronto

  debugLog("btnDef:", btnDef);
debugLog("secaoDef:", secaoDef);



  // 7) Dates → DataS + resultados
  // Função de callback comum para startDate
  function onStartDateChange() {
      // ajustar min do endDate
      endDate.min = startDate.value || DATE_MIN;
      atualizarEstadoDatas();
      atualizarResultados();
  }

  // Função de callback comum para endDate
  function onEndDateChange() {
      // ajustar max do startDate
      startDate.max = endDate.value || DATE_MAX;
      atualizarEstadoDatas();
      atualizarResultados();
  }

  // Atachar em input e change para robustez
  startDate.addEventListener("input", onStartDateChange);
  startDate.addEventListener("change", onStartDateChange);

  endDate.addEventListener("input", onEndDateChange);
  endDate.addEventListener("change", onEndDateChange);


  btnDef.addEventListener("click", () => {
      // 1) alterna visibilidade da secção
      const isHidden = getComputedStyle(secaoDef).display === "none";
      secaoDef.style.display = isHidden ? "block" : "none";

      
      // 3) escolhe o símbolo certo
      const newId = isHidden ? "chevron-up-logo" : "chevron-down-logo";
  
      // 4) atualiza o href (ou xlink:href, conforme o teu SVG)
      arrowUseDef.setAttribute("href", `icons.svg#${newId}`);
      // se o teu <use> usa xlink:href em vez de href, usa esta linha em vez da anterior:
      // arrowUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", icons.svg#${newId});
    });


  // 8) Botão Dias (chevron/menu)
  btnDias.addEventListener("click", () => {
      // 1) Toggle do painel .div3
      const aberto = !div3.classList.contains("hidden");
      div3.classList.toggle("hidden", aberto);
    
      // 2) Altera o símbolo (chevron-down ↔ chevron-up)
      //    se 'aberto' era true, vamos fechar => down; se false, vamos abrir => up
      const novoIcon = aberto ? "chevron-down-logo" : "chevron-up-logo";
      arrowUseDias.setAttribute("href", `icons.svg#${novoIcon}`);
  
      if (aberto) {
          estadoOmieAberto       = !div4.classList.contains("hidden");
          estadoCalendarioAberto = !div5.classList.contains("hidden");
          estadoTsAberto         = !div6.classList.contains("hidden");
  
          div4.classList.add("hidden");
          div5.classList.add("hidden");
          div6.classList.add("hidden");
  
          // 🟨 Esconder também os botões “Clear”
          btnClearOmie.classList.add("hidden");
          btnClearDates.classList.add("hidden");
          btnClearTs.classList.add("hidden");
  
      } else {
          div4.classList.toggle("hidden", !estadoOmieAberto);
          div5.classList.toggle("hidden", !estadoCalendarioAberto);
          div6.classList.toggle("hidden", !estadoTsAberto);
  
          // 🟩 Mostrar os “Clear” se o painel estiver visível
          btnClearOmie.classList.toggle("hidden", !estadoOmieAberto);
          btnClearDates.classList.toggle("hidden", !estadoCalendarioAberto);
          btnClearTs.classList.toggle("hidden", !estadoTsAberto);
      }
  });

  // Botão limpar meu tarifário
  document.getElementById("btnLimpar")?.addEventListener("click", () => {
      document.getElementById("fixo").value = "";
      document.getElementById("variavel").value = "";
      atualizarResultados();
  });
  

  // 9) Alternar abas “Meu tarifário” / “Outras opções”
  document.getElementById("abaMeuTarifario")
      .addEventListener("click", () => alternarAba("MeuTarifario"));
  document.getElementById("abaOutrasOpcoes")
      .addEventListener("click", () => alternarAba("OutrasOpcoes"));
  
  setTimeout(async () => {
      dadosCSV_grande = await carregarCSV(urlCSV_grande);
      adiarGrandes = false;
      debugLog("✅ CSV grande carregado em background");
  }, 1000); // Aguarda 1 segundo para não interferir com o carregamento inicial

  tippy.delegate(document.body, {
    theme: 'light-border',
    distance: 4,
    target: '.has-tooltip, .omie-info-icon',
    trigger: 'click',
    allowHTML: true,
    appendTo: () => document.body, // força anexar direto no <body>
    content(reference) {
      return reference.getAttribute('data-tippy-content');
    },
    // Se mesmo assim precisar, pode usar popperOptions para elevar z-index:
    popperOptions: {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: document.body
          }
        }
      ]
    }
  });
  
});
