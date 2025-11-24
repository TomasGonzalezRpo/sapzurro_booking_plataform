import React from "react";
// Importamos los iconos de la librería para las tarjetas de estadísticas
import { Users, Shield, UserCheck, TrendingUp } from "lucide-react";

// Este es el componente de la vista principal del Panel de Administración
const Dashboard = () => {
  // Lista de objetos para simular las estadísticas que vendrían de la API
  const stats = [
    {
      title: "Total Usuarios",
      value: "30",
      icon: Users, // El icono de "usuarios"
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Perfiles Activos",
      value: "1", // Solo hay un perfil, el de admin
      icon: Shield, // Icono de "escudo" o protección
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Usuarios Activos",
      value: "6",
      icon: UserCheck, // Icono de "usuario con check"
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Nuevos (mes)",
      value: "+24",
      icon: TrendingUp, // Icono de "gráfica ascendente"
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
            {/* Sección del título de la página */}     {" "}
      <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1> 
              <p className="text-gray-600 mt-2">Resumen general del sistema</p> 
           {" "}
      </div>
            {/* Contenedor de las tarjetas de estadísticas */}     {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Mapeamos el array de `stats` para dibujar cada tarjeta */} 
             {" "}
        {stats.map((stat, index) => {
          // Obtenemos el componente de icono del objeto
          const Icon = stat.icon;
          return (
            <div
              key={index} // Estilos de la tarjeta
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
            >
                           {" "}
              <div className="flex items-center justify-between mb-4">
                               {" "}
                {/* El círculo del icono con su color de fondo */}             
                 {" "}
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                   {" "}
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />{" "}
                  {/* El icono */}               {" "}
                </div>
                             {" "}
              </div>
                            {/* Título de la estadística */}             {" "}
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                                {stat.title}             {" "}
              </h3>
                            {/* El valor numérico grande */}             {" "}
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p> 
                       {" "}
            </div>
          );
        })}
             {" "}
      </div>
            {/* Sección de Actividad reciente */}     {" "}
      <div className="bg-white rounded-xl shadow-md p-6">
               {" "}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Actividad Reciente        {" "}
        </h2>
               {" "}
        <div className="space-y-4">
                   {" "}
          {/* Primer elemento de actividad (ejemplo de nuevo registro) */}     
             {" "}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                       {" "}
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-green-600" />   
                     {" "}
            </div>
                       {" "}
            <div className="flex-1">
                           {" "}
              <p className="text-sm font-semibold text-gray-800">
                                Nuevo usuario registrado              {" "}
              </p>
                           {" "}
              <p className="text-xs text-gray-500">
                                María Pérez - hace 2 horas              {" "}
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          {/* Segundo elemento de actividad (ejemplo de actualización) */}     
             {" "}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                       {" "}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />         
                             {" "}
            </div>
                       {" "}
            <div className="flex-1">
                           {" "}
              <p className="text-sm font-semibold text-gray-800">
                                Usuario actualizado              {" "}
              </p>
                           {" "}
              <p className="text-xs text-gray-500">
                                Juan García - hace 5 horas              {" "}
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          {/* Tercer elemento de actividad (ejemplo de cambio de perfil) */}   
               {" "}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                       {" "}
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />     
                   {" "}
            </div>
                       {" "}
            <div className="flex-1">
                           {" "}
              <p className="text-sm font-semibold text-gray-800">
                                Perfil modificado              {" "}
              </p>
                           {" "}
              <p className="text-xs text-gray-500">Admin - hace 1 día</p>       
                 {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Dashboard;
