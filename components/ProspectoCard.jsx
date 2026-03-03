import ProspectoCard from "@/components/ProspectoCard";

const mock = [
  {
    empresa: "nestle",
    direccion: "MARIANO ABASOLO 7",
    contacto: "Arturo Hernandez",
    correo: "pako.1440@gmail.com",
    telefono: "55676676776",
    estado: "MEETING_SCHEDULED",
    registro: "3/2/2026",
    cita: "5/2/2026, 4:06:00",
  },
  {
    empresa: "Alustrial Mexico",
    direccion: "Carlos Hank González 138",
    contacto: "saasassa",
    correo: "pako.1440@gmail.com",
    telefono: "5567680990",
    estado: "MEETING_SCHEDULED",
    registro: "30/1/2026",
    cita: "31/1/2026, 9:47:00",
  },
  {
    empresa: "Desarrollos Sustentables Bajío",
    direccion: "Blvd. Campestre 404, León, Gto",
    contacto: "Arq. Luis Hernández",
    correo: "lhernandez@dsbajio.com",
    telefono: "477-987-6543",
    estado: "MEETING_SCHEDULED",
    registro: "30/1/2026",
    cita: "5/2/2026, 4:00:00",
  },
  {
    empresa: "Grupo Inmobiliario Vertical",
    direccion: "Calle Reforma 500, CDMX",
    contacto: "Lic. Ana Sofía Méndez",
    correo: "amendez@grupovertical.mx",
    telefono: "55-8765-4321",
    estado: "CONTACTADO",
    registro: "29/1/2026",
    cita: null,
  },
];

export default function ProspectosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-neutral-900">Prospectos</h1>
        <p className="text-neutral-500 mt-1">
          Gestión de clientes potenciales y seguimiento
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mock.map((p, idx) => (
          <ProspectoCard key={idx} p={p} />
        ))}
      </div>
    </div>
  );
}