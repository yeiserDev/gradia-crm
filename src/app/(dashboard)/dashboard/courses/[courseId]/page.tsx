// page.tsx
import Image from "next/image";

export default function CourseOverviewPage() {
  return (
    <div className="relative flex flex-col items-center text-center px-4 py-10">

      {/* Imagen más pequeña y sin sombra */}
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <Image
          src="/dashboard/img7.png"
          alt="Selecciona un módulo"
          width={400}
          height={400}
          className="w-full h-auto opacity-100"
          priority
        />
      </div>

      {/* Texto */}
      <p className="mt-4 text-sm sm:text-base text-[color:var(--muted)] leading-relaxed max-w-md">
        Presiona un módulo o tareas que quieras ver en la columna izquierda.
      </p>
    </div>
  );
}
