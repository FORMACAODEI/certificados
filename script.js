const $ = id => document.getElementById(id);
const cpfInput = $('cpf'), msg = $('msg'), resultado = $('resultado'), viewer = $('viewer');
let urlAtual = null;

// Máscara 000.000.000-00
cpfInput.addEventListener('input', () => {
  let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  cpfInput.value = v;
});

function cpfValido(c) {
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += +c[i] * (t + 1 - i);
    const d = ((soma * 10) % 11) % 10;
    if (d !== +c[t]) return false;
  }
  return true;
}

function mostrarMsg(texto, ok = false) {
  msg.textContent = texto;
  msg.className = 'msg' + (ok ? ' ok' : '');
}

async function buscar() {
  const cpf = cpfInput.value.replace(/\D/g, '');
  resultado.hidden = true;
  if (urlAtual) { URL.revokeObjectURL(urlAtual); urlAtual = null; }

  if (!cpfValido(cpf)) return mostrarMsg('CPF inválido. Confira os números.');
  mostrarMsg('Buscando...', true);
  try {
    const r = await fetch(`certificados/${cpf}.pdf`, { cache: 'no-store' });
    if (!r.ok) throw new Error('nao encontrado');
    const blob = await r.blob();
    urlAtual = URL.createObjectURL(blob);
    viewer.src = urlAtual;
    $('btnBaixar').href = urlAtual;
    $('btnBaixar').download = `certificado-${cpf}.pdf`;
    resultado.hidden = false;
    mostrarMsg('Certificado encontrado!', true);
  } catch (e) {
    mostrarMsg('Certificado não encontrado para este CPF.');
  }
}

$('btnBuscar').addEventListener('click', buscar);
cpfInput.addEventListener('keydown', e => { if (e.key === 'Enter') buscar(); });
$('btnImprimir').addEventListener('click', () => {
  viewer.contentWindow.focus();
  viewer.contentWindow.print();
});
