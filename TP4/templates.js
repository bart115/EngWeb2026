const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.emdListPage = (tlist, d, sort,aux) => renderPug('index', { list: tlist, date: d, sort: sort, aux: aux });
exports.emdRegisterPage = (d) => renderPug('form', { date: d });
exports.emdEditPage = (emd, d) => renderPug('form', { emd: emd, date: d });
exports.emdIDPage = (emd, d) => renderPug('emdID', { emd: emd, date: d });
exports.errorPage = (msg, d) => renderPug('error', { message: msg, date: d });
