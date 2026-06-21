export interface ContractVars {
  cliente_nombre: string;
  cliente_nif: string;
  cliente_direccion: string;
  servicio: string;
  importe: string;
  plazo: string;
  lugar: string;
  fecha: string;
}

// Campos que se rellenan al generar el PDF (la plantilla usa {{clave}})
export const CONTRACT_FIELDS: { key: keyof ContractVars; label: string; placeholder: string }[] = [
  { key: "cliente_nombre",   label: "Nombre / razón social del cliente", placeholder: "Acme S.L." },
  { key: "cliente_nif",      label: "NIF / CIF del cliente",             placeholder: "B12345678" },
  { key: "cliente_direccion",label: "Domicilio del cliente",             placeholder: "Calle Mayor 1, Madrid" },
  { key: "servicio",         label: "Servicio contratado",               placeholder: "Desarrollo de web corporativa con integración de IA" },
  { key: "importe",          label: "Importe total",                     placeholder: "2.490 € (IVA incluido)" },
  { key: "plazo",            label: "Plazo de ejecución",                placeholder: "4 semanas" },
  { key: "lugar",            label: "Lugar de firma",                    placeholder: "Madrid" },
  { key: "fecha",            label: "Fecha",                             placeholder: "21 de junio de 2026" },
];

// Sustituye {{clave}} por su valor; deja un hueco subrayado si está vacío.
export function fillTemplate(template: string, vars: Partial<ContractVars>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = (vars as Record<string, string | undefined>)[key];
    return value != null && value.trim() !== "" ? value : "__________";
  });
}

export const DEFAULT_CONTRACT_TEMPLATE = `CONTRATO DE PRESTACIÓN DE SERVICIOS

En {{lugar}}, a {{fecha}}.

REUNIDOS

De una parte, Juan Gutiérrez de la Concha de la Cuesta, mayor de edad, con NIF 72173348S y domicilio profesional a efectos de notificaciones en mindbride.net, en adelante "EL PRESTADOR".

De otra parte, {{cliente_nombre}}, con NIF/CIF {{cliente_nif}} y domicilio en {{cliente_direccion}}, en adelante "EL CLIENTE".

Ambas partes se reconocen capacidad legal suficiente para contratar y obligarse, y

EXPONEN

I. Que EL PRESTADOR se dedica profesionalmente al desarrollo web y a la integración de soluciones de inteligencia artificial.

II. Que EL CLIENTE está interesado en la contratación de los siguientes servicios: {{servicio}}.

III. Que ambas partes acuerdan formalizar el presente contrato con arreglo a las siguientes

CLÁUSULAS

PRIMERA — OBJETO.
EL PRESTADOR se compromete a prestar a EL CLIENTE los servicios descritos en el expositivo II, conforme a las especificaciones acordadas entre las partes.

SEGUNDA — PRECIO Y FORMA DE PAGO.
El precio total de los servicios asciende a {{importe}}. El pago se realizará mediante transferencia bancaria o Bizum según las condiciones acordadas entre las partes. EL PRESTADOR emitirá la factura correspondiente.

TERCERA — PLAZO DE EJECUCIÓN.
Los servicios se ejecutarán en un plazo estimado de {{plazo}} desde la confirmación del encargo y la recepción por parte de EL CLIENTE de los materiales y accesos necesarios.

CUARTA — OBLIGACIONES DEL CLIENTE.
EL CLIENTE se compromete a facilitar la información, contenidos y accesos necesarios para la correcta ejecución de los servicios, así como a abonar el precio en los términos pactados.

QUINTA — PROPIEDAD INTELECTUAL.
Una vez satisfecho el precio íntegro, EL CLIENTE adquirirá los derechos de uso sobre el trabajo entregado. EL PRESTADOR se reserva el derecho a referenciar el proyecto en su portfolio profesional.

SEXTA — CONFIDENCIALIDAD.
Ambas partes se comprometen a mantener la confidencialidad sobre la información a la que tengan acceso con motivo del presente contrato.

SÉPTIMA — PROTECCIÓN DE DATOS.
Las partes tratarán los datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y a la normativa española vigente en materia de protección de datos.

OCTAVA — RESOLUCIÓN.
El incumplimiento de cualquiera de las obligaciones esenciales facultará a la parte cumplidora para resolver el contrato, sin perjuicio de las indemnizaciones que correspondan.

NOVENA — LEGISLACIÓN Y JURISDICCIÓN.
El presente contrato se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio de EL CLIENTE, salvo pacto en contrario.

Y en prueba de conformidad, ambas partes firman el presente contrato por duplicado en el lugar y fecha indicados al inicio.



EL PRESTADOR                                        EL CLIENTE

Juan Gutiérrez de la Concha                         {{cliente_nombre}}
NIF 72173348S                                        NIF/CIF {{cliente_nif}}
`;
