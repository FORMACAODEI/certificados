// Cole este código no Google Apps Script (conta da formação)
const PASTA_ID = 'COLE_AQUI_O_ID_DA_PASTA_DO_DRIVE';

function doGet(e) {
  const cpf = ((e && e.parameter && e.parameter.cpf) || '').replace(/\D/g, '');
  if (cpf.length !== 11) return resposta({ ok: false });

  const arquivos = DriveApp.getFolderById(PASTA_ID).getFilesByName(cpf + '.pdf');
  if (!arquivos.hasNext()) return resposta({ ok: false });

  const bytes = arquivos.next().getBlob().getBytes();
  return resposta({ ok: true, pdf: Utilities.base64Encode(bytes) });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
