/**
 * ScientifIC Pro - Calculatrice Scientifique
 * ==========================================
 * Parser mathématique sécurisé - Pas d'eval() ni Function()
 */

(function() {
    'use strict';

    const PI = Math.PI;
    const E = Math.E;
    const MAX_RESULT = 1e308;
    const MIN_RESULT = -1e308;

    const state = {
        expression: '',
        result: '0',
        memory: 0,
        isRadian: false,
        isSecondFunc: false,
        isHyperbolic: false,
        hasError: false,
        lastAnswer: null,
        openParens: 0,
        lastWasOperator: false,
        calculationCount: 0,
        lastCalcTime: 0
    };

    const tokens = {
        num: /^-?\d+\.?\d*$/,
        op: /^[\+\-\×\÷\+\−\−\×\÷]$/
    };

    const display = {
        el: document.getElementById('display'),
        expr: document.getElementById('expression'),
        result: document.getElementById('result')
    };

    const indicators = {
        deg: document.getElementById('degIndicator'),
        rad: document.getElementById('radIndicator'),
        '2nd': document.getElementById('2ndIndicator'),
        hyp: document.getElementById('hypIndicator')
    };

    function sanitize(str) {
        if (typeof str !== 'string') return '0';
        return str.replace(/[<>\"\'\\]/g, '').trim();
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function updateDisplay() {
        display.expr.textContent = escapeHtml(state.expression) || ' ';
        display.result.textContent = state.hasError ? 'Error' : escapeHtml(state.result);
        
        if (state.hasError) {
            display.el.classList.add('error');
        } else {
            display.el.classList.remove('error');
        }
    }

    function updateIndicators() {
        indicators.deg.classList.toggle('active', !state.isRadian);
        indicators.rad.classList.toggle('active', state.isRadian);
        indicators['2nd'].classList.toggle('active', state.isSecondFunc);
        indicators.hyp.classList.toggle('active', state.isHyperbolic);

        const sinBtn = document.querySelector('[data-value="sin"]');
        const cosBtn = document.querySelector('[data-value="cos"]');
        const tanBtn = document.querySelector('[data-value="tan"]');

        if (state.isSecondFunc) {
            sinBtn.textContent = 'sin⁻¹';
            cosBtn.textContent = 'cos⁻¹';
            tanBtn.textContent = 'tan⁻¹';
        } else {
            sinBtn.textContent = 'sin';
            cosBtn.textContent = 'cos';
            tanBtn.textContent = 'tan';
        }
    }

    function rateLimit() {
        const now = Date.now();
        if (now - state.lastCalcTime < 50 && state.calculationCount > 5) {
            return false;
        }
        state.lastCalcTime = now;
        state.calculationCount = Math.max(0, state.calculationCount - 1);
        return true;
    }

    function toRadians(value) {
        return state.isRadian ? value : (value * PI / 180);
    }

    function fromRadians(value) {
        return state.isRadian ? value : (value * 180 / PI);
    }

    function factorial(n) {
        n = Math.floor(n);
        if (n < 0) return NaN;
        if (n > 170) return Infinity;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function safeUnary(func) {
        try {
            const val = parseFloat(state.result);
            if (isNaN(val)) return 'Error';
            if (!isFinite(val) && val !== 0) return val > 0 ? 'Infinity' : '-Infinity';
            const result = func(val);
            if (typeof result !== 'number' || isNaN(result)) return 'Error';
            if (!isFinite(result)) return result > 0 ? 'Infinity' : '-Infinity';
            if (Math.abs(result) > MAX_RESULT) return 'Overflow';
            return String(result);
        } catch (e) {
            return 'Error';
        }
    }

    const mathFuncs = {
        sin: (v) => Math.sin(toRadians(v)),
        cos: (v) => Math.cos(toRadians(v)),
        tan: (v) => Math.tan(toRadians(v)),
        asin: (v) => fromRadians(Math.asin(v)),
        acos: (v) => fromRadians(Math.acos(v)),
        atan: (v) => fromRadians(Math.atan(v)),
        sinh: (v) => Math.sinh(v),
        cosh: (v) => Math.cosh(v),
        tanh: (v) => Math.tanh(v),
        asinh: (v) => Math.asinh(v),
        acosh: (v) => Math.acosh(v),
        atanh: (v) => Math.atanh(v),
        ln: (v) => Math.log(v),
        log: (v) => Math.log10(v),
        exp: (v) => Math.exp(v),
        pow10: (v) => Math.pow(10, v),
        sqrt: (v) => Math.sqrt(v),
        cbrt: (v) => Math.cbrt(v),
        fact: (v) => factorial(v)
    };

    function applyFunction(funcName) {
        if (funcName === 'pow') {
            state.expression += '^';
            state.lastWasOperator = false;
            updateDisplay();
            return;
        }

        let func = mathFuncs[funcName];

        if (state.isHyperbolic) {
            const hypMap = {
                sin: 'sinh', cos: 'cosh', tan: 'tanh',
                asin: 'asinh', acos: 'acosh', atan: 'atanh'
            };
            if (hypMap[funcName]) {
                func = mathFuncs[hypMap[funcName]];
            }
        }

        if (func) {
            state.result = safeUnary(func);
            state.expression += funcName + '(';
            state.openParens++;
            state.lastWasOperator = false;
            updateDisplay();
        }
    }

    function handleNumber(num) {
        if (state.hasError) {
            state.result = '0';
            state.expression = '';
            state.hasError = false;
        }
        if (state.result === '0' && num !== '.') {
            state.result = num;
        } else if (num === '.' && state.result.includes('.')) {
            return;
        } else {
            state.result += num;
        }
        state.lastWasOperator = false;
        updateDisplay();
    }

    function handleOperator(op) {
        if (state.hasError) return;
        
        const opSymbols = {
            add: '+',
            subtract: '−',
            multiply: '×',
            divide: '÷'
        };

        if (state.lastWasOperator) {
            state.expression = state.expression.slice(0, -1);
        }

        state.expression += state.result + ' ' + opSymbols[op] + ' ';
        state.result = '0';
        state.lastWasOperator = true;
        state.openParens = 0;
        updateDisplay();
    }

    function handleEquals() {
        if (!rateLimit()) return;
        if (state.hasError) return;

        try {
            let expr = state.expression + ' ' + state.result;
            expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            expr = expr.replace(/π/g, String(PI)).replace(/e(?![x])/g, String(E));

            const tokens = tokenize(expr);
            if (!tokens) {
                state.hasError = true;
                updateDisplay();
                return;
            }

            const result = evaluate(tokens);
            if (typeof result !== 'number' || isNaN(result)) {
                state.hasError = true;
            } else if (!isFinite(result)) {
                state.hasError = true;
                state.result = result > 0 ? 'Infinity' : '-Infinity';
            } else if (Math.abs(result) > MAX_RESULT) {
                state.hasError = true;
                state.result = 'Overflow';
            } else {
                state.result = formatResult(result);
                state.lastAnswer = result;
            }
        } catch (e) {
            state.hasError = true;
        }

        state.expression = '';
        state.calculationCount++;
        updateDisplay();
    }

    function tokenize(expr) {
        const tokens = [];
        const numRegex = /^-?\d+\.?\d*$/;
        let current = '';
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (char === ' ' && !current.match(/^\d+\.?\d*$/)) {
                continue;
            }
            
            if (char.match(/\d/) || char === '.' || (char === '-' && (current === '' || current === '(' || current.match(/[\+\-\*\/\(\^]/)))) {
                current += char;
            } else if (char === '-' && current === '') {
                current = '-';
            } else if (char.match(/[\+\-\*\/\(\)\^]/)) {
                if (current) {
                    if (current.match(numRegex)) {
                        tokens.push({ type: 'number', value: parseFloat(current) });
                    }
                    current = '';
                }
                tokens.push({ type: 'operator', value: char });
            } else if (current.match(numRegex)) {
                tokens.push({ type: 'number', value: parseFloat(current) });
                current = '';
                i--;
            }
        }
        
        if (current) {
            if (current.match(numRegex)) {
                tokens.push({ type: 'number', value: parseFloat(current) });
            }
        }
        
        return tokens.length > 0 ? tokens : null;
    }

    function evaluate(tokens) {
        const output = [];
        const ops = [];
        
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
        const associativity = { '+': 'left', '-': 'left', '*': 'left', '/': 'left', '^': 'right' };
        
        for (const token of tokens) {
            if (token.type === 'number') {
                output.push(token.value);
            } else if (token.type === 'operator') {
                while (ops.length > 0) {
                    const top = ops[ops.length - 1];
                    if (top === '(') break;
                    if (precedence[top] > precedence[token.value] ||
                        (precedence[top] === precedence[token.value] && associativity[token.value] === 'left')) {
                        output.push(ops.pop());
                    } else {
                        break;
                    }
                }
                ops.push(token.value);
            } else if (token.value === '(') {
                ops.push(token.value);
            } else if (token.value === ')') {
                while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                    output.push(ops.pop());
                }
                if (ops.length === 0) return NaN;
                ops.pop();
            }
        }
        
        while (ops.length > 0) {
            const op = ops.pop();
            if (op === '(' || op === ')') return NaN;
            output.push(op);
        }
        
        const stack = [];
        for (const item of output) {
            if (typeof item === 'number') {
                stack.push(item);
            } else {
                if (stack.length < 2) return NaN;
                const b = stack.pop();
                const a = stack.pop();
                let result;
                switch (item) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = b === 0 ? Infinity : a / b; break;
                    case '^': result = Math.pow(a, b); break;
                    default: return NaN;
                }
                stack.push(result);
            }
        }
        
        return stack.length === 1 ? stack[0] : NaN;
    }

    function formatResult(num) {
        if (Math.abs(num) < 1e-10) return '0';
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(8);
        }
        const str = String(num);
        if (str.length > 12) {
            return parseFloat(num.toPrecision(10)).toString();
        }
        return str;
    }

    function handleClear() {
        state.expression = '';
        state.result = '0';
        state.hasError = false;
        state.openParens = 0;
        state.lastWasOperator = false;
        updateDisplay();
    }

    function handleClearEntry() {
        state.result = '0';
        updateDisplay();
    }

    function handleBackspace() {
        if (state.hasError) {
            handleClear();
            return;
        }
        if (state.result.length > 1) {
            state.result = state.result.slice(0, -1);
        } else {
            state.result = '0';
        }
        updateDisplay();
    }

    function handleDecimal() {
        if (state.hasError) {
            state.result = '0';
            state.hasError = false;
        }
        if (!state.result.includes('.')) {
            state.result += '.';
        }
        updateDisplay();
    }

    function handleNegate() {
        if (state.hasError) return;
        const val = parseFloat(state.result);
        if (val === 0) return;
        state.result = String(-val);
        updateDisplay();
    }

    function handlePercent() {
        if (state.hasError) return;
        const val = parseFloat(state.result);
        state.result = String(val / 100);
        updateDisplay();
    }

    function handleAns() {
        if (state.lastAnswer !== null) {
            state.result = formatResult(state.lastAnswer);
            updateDisplay();
        }
    }

    function handleMemory(action) {
        const current = parseFloat(state.result);
        switch (action) {
            case 'store':
                state.memory = isNaN(current) ? 0 : current;
                break;
            case 'recall':
                state.result = formatResult(state.memory);
                break;
            case 'add':
                state.memory += isNaN(current) ? 0 : current;
                break;
            case 'subtract':
                state.memory -= isNaN(current) ? 0 : current;
                break;
        }
        updateDisplay();
    }

    function handleParenthesis(type) {
        if (state.hasError) {
            state.expression = '';
            state.hasError = false;
        }
        if (type === 'open') {
            state.expression += '(';
            state.openParens++;
        } else if (type === 'close' && state.openParens > 0) {
            state.expression += ')';
            state.openParens--;
        }
        updateDisplay();
    }

    function handleConstant(name) {
        if (state.hasError) {
            state.result = '0';
            state.expression = '';
            state.hasError = false;
        }
        state.result = name === 'pi' ? formatResult(PI) : formatResult(E);
        updateDisplay();
    }

    function handleMode(mode) {
        state.isRadian = (mode === 'rad');
        updateIndicators();
    }

    function toggle2nd() {
        state.isSecondFunc = !state.isSecondFunc;
        updateIndicators();
    }

    function toggleHyp() {
        state.isHyperbolic = !state.isHyperbolic;
        updateIndicators();
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action;
            const value = this.dataset.value;
            const param = this.dataset.param;

            switch (action) {
                case 'num':
                    handleNumber(value);
                    break;
                case 'op':
                    handleOperator(value);
                    break;
                case 'equals':
                    handleEquals();
                    break;
                case 'clear':
                    handleClear();
                    break;
                case 'clearEntry':
                    handleClearEntry();
                    break;
                case 'backspace':
                    handleBackspace();
                    break;
                case 'decimal':
                    handleDecimal();
                    break;
                case 'negate':
                    handleNegate();
                    break;
                case 'percent':
                    handlePercent();
                    break;
                case 'ans':
                    handleAns();
                    break;
                case 'func':
                    applyFunction(param === 'y' ? 'pow' : value);
                    if (param === 'y') {
                        state.result = '0';
                    }
                    break;
                case 'memory':
                    handleMemory(value);
                    break;
                case 'mode':
                    handleMode(value);
                    break;
                case '2nd':
                    toggle2nd();
                    break;
                case 'hyp':
                    toggleHyp();
                    break;
                case 'open':
                case 'close':
                    handleParenthesis(action);
                    break;
                case 'constant':
                    handleConstant(value);
                    break;
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        if (/^[0-9]$/.test(key)) {
            e.preventDefault();
            handleNumber(key);
        } else if (key === '.') {
            e.preventDefault();
            handleDecimal();
        } else if (key === '+') {
            e.preventDefault();
            handleOperator('add');
        } else if (key === '-') {
            e.preventDefault();
            handleOperator('subtract');
        } else if (key === '*') {
            e.preventDefault();
            handleOperator('multiply');
        } else if (key === '/') {
            e.preventDefault();
            handleOperator('divide');
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            handleEquals();
        } else if (key === 'Escape') {
            e.preventDefault();
            handleClear();
        } else if (key === 'Backspace') {
            e.preventDefault();
            handleBackspace();
        } else if (key === '%') {
            e.preventDefault();
            handlePercent();
        } else if (key === '(' || key === ')') {
            e.preventDefault();
            handleParenthesis(key === '(' ? 'open' : 'close');
        }
    });

    updateIndicators();
    updateDisplay();
})();
