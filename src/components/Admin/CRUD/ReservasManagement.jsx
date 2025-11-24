import React, { useMemo, useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Search,
  X,
  Calendar,
  Hotel,
  Activity,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import axios from "axios";

// Aquí va la URL base de la API
const API_BASE_URL = "http://localhost:5000/api/reservas";

const ReservasManagement = () => {
  // Lista de todas las reservas que trae el backend
  const [reservas, setReservas] = useState([]); // Para saber si estamos esperando la respuesta del servidor
  const [isLoading, setIsLoading] = useState(true); // Para guardar si hay algún error de API
  const [apiError, setApiError] = useState(null); // Lo que el usuario escribe para buscar
  const [searchTerm, setSearchTerm] = useState(""); // Filtro por estado: 'todas', 'pendiente', etc.
  const [filterEstado, setFilterEstado] = useState("todas"); // Filtro por tipo de servicio
  const [filterTipo, setFilterTipo] = useState("todos"); // Muestra u oculta el modal de detalles
  const [showModal, setShowModal] = useState(false); // La reserva que está seleccionada para ver o editar
  const [selectedReserva, setSelectedReserva] = useState(null); // El nuevo estado que queremos aplicar
  const [updateEstado, setUpdateEstado] = useState("confirmada"); // Función asíncrona para obtener todas las reservas del admin

  const fetchReservas = async () => {
    setIsLoading(true); // Empezamos a cargar
    setApiError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/todas`);
      setReservas(response.data.reservas || []);
    } catch (err) {
      console.error("Error al obtener reservas:", err);
      setApiError(
        "No se pudo conectar con el servidor o cargar las reservas. Asegúrese de que el backend esté corriendo."
      );
      setReservas([]);
    } finally {
      setIsLoading(false); // Terminamos de cargar
    }
  }; // Hook que llama a fetchReservas al montar el componente

  useEffect(() => {
    fetchReservas();
  }, []); // useMemo para calcular la lista de reservas filtradas

  const filteredReservas = useMemo(() => {
    let filtered = reservas; // Filtra por el campo tipo_servicio

    if (filterTipo !== "todos") {
      filtered = filtered.filter((r) => r.tipo_servicio === filterTipo);
    } // Filtra por el estado de la reserva

    if (filterEstado !== "todas") {
      filtered = filtered.filter((r) => r.estado === filterEstado);
    } // Filtra usando la barra de búsqueda (por varios campos)

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (r) =>
          r.nombre_servicio.toLowerCase().includes(q) ||
          r.nombres?.toLowerCase().includes(q) ||
          r.correo?.toLowerCase().includes(q) ||
          r.id_reserva.toString().includes(q)
      );
    }

    return filtered;
  }, [reservas, searchTerm, filterEstado, filterTipo]); // Función para abrir el modal con los datos de una reserva

  const openModal = (reserva) => {
    setSelectedReserva(reserva);
    setUpdateEstado(reserva.estado);
    setShowModal(true);
  }; // Función para cerrar el modal y resetear la reserva seleccionada

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedReserva(null);
      setUpdateEstado("confirmada");
    }, 200);
  }; // Manejador para actualizar el estado de una reserva en el backend

  const handleActualizarEstado = async () => {
    if (!selectedReserva) return; // Salir si no hay nada seleccionado

    try {
      // Hacemos la llamada PUT para cambiar el estado
      await axios.put(`${API_BASE_URL}/${selectedReserva.id_reserva}/estado`, {
        estado: updateEstado,
      });
      alert("Estado actualizado exitosamente");
      closeModal();
      fetchReservas(); // Volvemos a pedir los datos
    } catch (error) {
      alert(
        `Error: ${
          error.response?.data?.message || "Error al actualizar estado"
        }`
      );
    }
  }; // Manejador para eliminar una reserva con confirmación previa

  const handleEliminar = async (reserva) => {
    if (
      !confirm(
        `¿Está seguro de ELIMINAR PERMANENTEMENTE la reserva #${reserva.id_reserva}? Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      // Hacemos la llamada DELETE
      await axios.delete(`${API_BASE_URL}/${reserva.id_reserva}`);
      alert("Reserva eliminada exitosamente");
      fetchReservas(); // Refrescamos la lista
    } catch (error) {
      alert(
        `Error: ${error.response?.data?.message || "Error al eliminar reserva"}`
      );
    }
  }; // Función simple para mostrar la fecha en formato local

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }; // Devuelve un icono de Lucide basado en el tipo de servicio

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "hotel":
        return <Hotel className="w-4 h-4" />;
      case "actividad":
        return <Activity className="w-4 h-4" />;
      case "restaurante":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "ruta":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  }; // Devuelve las clases de color de Tailwind para la etiqueta

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "hotel":
        return "bg-blue-100 text-blue-700";
      case "actividad":
        return "bg-green-100 text-green-700";
      case "restaurante":
        return "bg-orange-100 text-orange-700";
      case "ruta":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }; // Si está cargando, mostramos un mensaje al usuario

  if (isLoading) {
    return (
      <div className="text-center py-20">
               {" "}
        <p className="text-xl text-cyan-600 font-semibold">
                    Cargando reservas desde el servidor...        {" "}
        </p>
                {/* Esto es un indicador de carga */}     {" "}
      </div>
    );
  } // Si hay un error de conexión, lo mostramos

  if (apiError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error de Conexión: </strong>     
          <span className="block sm:inline">{apiError}</span>       {" "}
        <button
          onClick={fetchReservas}
          className="ml-4 underline font-semibold"
        >
                    Intentar Recargar        {" "}
        </button>
             {" "}
      </div>
    );
  }

  return (
    <div className="space-y-6">
            {/* Header */}     {" "}
      <div className="flex items-center justify-between">
               {" "}
        <div>
                   {" "}
          <h1 className="text-3xl font-bold text-gray-800">
                        Gestión de Reservas          {" "}
          </h1>
                   {" "}
          <p className="text-gray-600 mt-2">
                        Administra todas las reservas (hoteles, actividades,
            restaurantes y             rutas)          {" "}
          </p>
                 {" "}
        </div>
               {" "}
        <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg font-semibold">
                    Total: {reservas.length} reservas        {" "}
        </div>
             {" "}
      </div>
            {/* Filtros */}     {" "}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
               {" "}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda */}         {" "}
          <div className="relative md:col-span-2">
                       {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       {" "}
            <input
              type="text"
              placeholder="Buscar por servicio, huésped, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
                     {" "}
          </div>
                    {/* Filtro de tipo */}         {" "}
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
                        <option value="todos">Todos los servicios</option>     
                  <option value="hotel">Hoteles</option>           {" "}
            <option value="actividad">Actividades</option>           {" "}
            <option value="restaurante">Restaurantes</option>           {" "}
            <option value="ruta">Rutas</option>         {" "}
          </select>
                    {/* Filtro de estado */}         {" "}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
                        <option value="todas">Todos los estados</option>       
                <option value="pendiente">Pendientes</option>           {" "}
            <option value="confirmada">Confirmadas</option>           {" "}
            <option value="cancelada">Canceladas</option>         {" "}
          </select>
                 {" "}
        </div>
                {/* Aquí termina la sección de filtros */}     {" "}
      </div>
            {/* Tabla */}     {" "}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
               {" "}
        <table className="w-full">
                   {" "}
          <thead className="bg-gray-50 border-b border-gray-200">
                       {" "}
            <tr>
                            {/* Mapeamos los encabezados de la tabla */}       
                   {" "}
              {[
                "ID",
                "Tipo",
                "Servicio",
                "Huésped",
                "Entrada",
                "Salida",
                "Personas",
                "Estado",
                "Total",
                "Acciones",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-4 text-left text-sm font-semibold text-gray-700 ${
                    h === "Acciones" ? "text-center" : ""
                  }`}
                >
                                    {h}               {" "}
                </th>
              ))}
                         {" "}
            </tr>
                     {" "}
          </thead>
                   {" "}
          <tbody className="divide-y divide-gray-200">
                        {/* Iteramos sobre la lista de reservas filtradas */}   
                   {" "}
            {filteredReservas.map((reserva) => (
              <tr
                key={reserva.id_reserva}
                className="hover:bg-gray-50 transition-colors"
              >
                               {" "}
                <td className="px-4 py-4 text-sm font-semibold text-cyan-600">
                                    #{reserva.id_reserva}               {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm">
                                   {" "}
                  {/* Mostramos el tipo de servicio con su color e icono */}   
                               {" "}
                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getTipoColor(
                      reserva.tipo_servicio
                    )}`}
                  >
                                        {getTipoIcon(reserva.tipo_servicio)}   
                                   {" "}
                    <span>
                                           {" "}
                      {reserva.tipo_servicio.charAt(0).toUpperCase() +
                        reserva.tipo_servicio.slice(1)}
                                         {" "}
                    </span>
                                     {" "}
                  </span>
                                 {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm text-gray-800">
                                    {reserva.nombre_servicio}               {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm text-gray-800">
                                   {" "}
                  <div>
                                       {" "}
                    <p className="font-medium">
                                            {reserva.nombres}{" "}
                      {reserva.apellidos}                   {" "}
                    </p>
                                       {" "}
                    <p className="text-xs text-gray-500">{reserva.correo}</p>   
                                 {" "}
                  </div>
                                 {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm text-gray-600">
                                    {formatDate(reserva.fecha_inicio)}         
                       {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm text-gray-600">
                                   {" "}
                  {reserva.fecha_fin ? formatDate(reserva.fecha_fin) : "-"}     
                           {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm text-gray-600">
                                    {reserva.cantidad_personas}               {" "}
                </td>
                               {" "}
                <td className="px-4 py-4">
                                   {" "}
                  {/* Etiqueta de estado con color dinámico */}                 {" "}
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      reserva.estado === "confirmada"
                        ? "bg-green-100 text-green-700"
                        : reserva.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                                       {" "}
                    {reserva.estado.charAt(0).toUpperCase() +
                      reserva.estado.slice(1)}
                                     {" "}
                  </span>
                                 {" "}
                </td>
                               {" "}
                <td className="px-4 py-4 text-sm font-semibold text-cyan-600">
                                    {/* Formato de moneda para el total */}     
                              ${reserva.precio_total.toLocaleString("es-CO")}   
                             {" "}
                </td>
                                {/* ACCIONES */}               {" "}
                <td className="px-4 py-4">
                                   {" "}
                  <div className="flex items-center justify-center space-x-2">
                                       {" "}
                    {/* Botón para ver los detalles en el modal */}             
                         {" "}
                    <button
                      onClick={() => openModal(reserva)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Ver detalles"
                    >
                                            <Eye className="w-4 h-4" />         
                               {" "}
                    </button>
                                        {/* Botón para eliminar la reserva */} 
                                     {" "}
                    <button
                      onClick={() => handleEliminar(reserva)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar"
                    >
                                            <Trash2 className="w-4 h-4" />     
                                   {" "}
                    </button>
                                     {" "}
                  </div>
                                 {" "}
                </td>
                             {" "}
              </tr>
            ))}
                     {" "}
          </tbody>
                 {" "}
        </table>
                {/* Mensaje si no hay resultados */}       {" "}
        {filteredReservas.length === 0 && (
          <div className="text-center py-12">
                       {" "}
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />       
                <p className="text-gray-500">No se encontraron reservas</p>     
                  {/* Muestra un icono de calendario gris */}         {" "}
          </div>
        )}
             {" "}
      </div>
            {/* Modal de detalles y edición */}     {" "}
      {showModal && selectedReserva && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
                   {" "}
          <div
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
                        {/* Header del Modal */}           {" "}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                           {" "}
              <h3 className="text-xl font-bold text-gray-800">
                                Detalles de Reserva #
                {selectedReserva.id_reserva}             {" "}
              </h3>
                           {" "}
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                                <X className="w-6 h-6" />             {" "}
              </button>
                         {" "}
            </div>
                        {/* Body del Modal */}           {" "}
            <div className="p-6 space-y-6">
                            {/* Tipo de servicio */}             {" "}
              <div>
                               {" "}
                <p className="text-sm text-gray-500 mb-2">Tipo de Servicio</p> 
                             {" "}
                <span
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold ${getTipoColor(
                    selectedReserva.tipo_servicio
                  )}`}
                >
                                    {getTipoIcon(selectedReserva.tipo_servicio)}
                                   {" "}
                  <span>
                                       {" "}
                    {selectedReserva.tipo_servicio.charAt(0).toUpperCase() +
                      selectedReserva.tipo_servicio.slice(1)}
                                     {" "}
                  </span>
                                 {" "}
                </span>
                             {" "}
              </div>
                            {/* Información de la reserva */}             {" "}
              <div className="grid grid-cols-2 gap-4">
                               {" "}
                <div>
                                   {" "}
                  <p className="text-sm text-gray-500">Servicio</p>             
                     {" "}
                  <p className="font-semibold text-gray-800">
                                        {selectedReserva.nombre_servicio}       
                             {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                <div>
                                   {" "}
                  <p className="text-sm text-gray-500">Descripción</p>         
                         {" "}
                  <p className="font-semibold text-gray-800">
                                       {" "}
                    {selectedReserva.descripcion_servicio || "N/A"}             
                       {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                <div>
                                   {" "}
                  <p className="text-sm text-gray-500">Fecha de Entrada</p>     
                             {" "}
                  <p className="font-semibold text-gray-800">
                                       {" "}
                    {formatDate(selectedReserva.fecha_inicio)}                 {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                {selectedReserva.fecha_fin && (
                  <div>
                                       {" "}
                    <p className="text-sm text-gray-500">Fecha de Salida</p>   
                                   {" "}
                    <p className="font-semibold text-gray-800">
                                           {" "}
                      {formatDate(selectedReserva.fecha_fin)}                   {" "}
                    </p>
                                     {" "}
                  </div>
                )}
                               {" "}
                <div>
                                   {" "}
                  <p className="text-sm text-gray-500">Cantidad de Personas</p> 
                                 {" "}
                  <p className="font-semibold text-gray-800">
                                        {selectedReserva.cantidad_personas}     
                               {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                {selectedReserva.cantidad_habitaciones && (
                  <div>
                                       {" "}
                    <p className="text-sm text-gray-500">Habitaciones</p>       
                               {" "}
                    <p className="font-semibold text-gray-800">
                                           {" "}
                      {selectedReserva.cantidad_habitaciones}                   {" "}
                    </p>
                                     {" "}
                  </div>
                )}
                             {" "}
              </div>
                            {/* Información del huésped */}             {" "}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                               {" "}
                <h4 className="font-semibold text-gray-800">
                                    Información del Huésped                {" "}
                </h4>
                               {" "}
                <p>
                                   {" "}
                  <span className="text-gray-600">Nombre:</span>                
                   {" "}
                  <span className="font-medium">
                                        {selectedReserva.nombres}{" "}
                    {selectedReserva.apellidos}                 {" "}
                  </span>
                                 {" "}
                </p>
                               {" "}
                <p>
                                   {" "}
                  <span className="text-gray-600">Email:</span>                
                   {" "}
                  <span className="font-medium">{selectedReserva.correo}</span> 
                               {" "}
                </p>
                               {" "}
                <p>
                                   {" "}
                  <span className="text-gray-600">Teléfono:</span>              
                     {" "}
                  <span className="font-medium">
                                        {selectedReserva.telefono || "N/A"}     
                               {" "}
                  </span>
                                 {" "}
                </p>
                             {" "}
              </div>
                            {/* Información de precios */}             {" "}
              <div className="bg-cyan-50 rounded-lg p-4 space-y-2">
                               {" "}
                <p>
                                   {" "}
                  <span className="text-gray-600">Precio Unitario:</span>      
                             {" "}
                  <span className="font-semibold">
                                        $
                    {selectedReserva.precio_unitario.toLocaleString("es-CO")}   
                                 {" "}
                  </span>
                                 {" "}
                </p>
                               {" "}
                <p>
                                   {" "}
                  <span className="text-gray-600">Cantidad:</span>              
                     {" "}
                  <span className="font-semibold">
                                        {selectedReserva.cantidad}             
                       {" "}
                  </span>
                                 {" "}
                </p>
                               {" "}
                <p>
                                   {" "}
                  <span className="text-gray-600">Precio Total:</span>          
                         {" "}
                  <span className="font-bold text-lg text-cyan-700">
                                        $
                    {selectedReserva.precio_total.toLocaleString("es-CO")}     
                               {" "}
                  </span>
                                 {" "}
                </p>
                             {" "}
              </div>
                            {/* Cambiar estado */}             {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cambiar Estado                {" "}
                </label>
                                {/* Dropdown para elegir el nuevo estado */}   
                           {" "}
                <select
                  value={updateEstado}
                  onChange={(e) => setUpdateEstado(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                                    <option value="pendiente">Pendiente</option>
                                   {" "}
                  <option value="confirmada">Confirmada</option>               
                    <option value="cancelada">Cancelada</option>               {" "}
                </select>
                             {" "}
              </div>
                            {/* Comentarios del usuario */}             {" "}
              {selectedReserva.notas_admin && (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                   {" "}
                  <h4 className="font-semibold text-gray-800 mb-2">
                                        💬 Comentarios del Usuario              
                       {" "}
                  </h4>
                                   {" "}
                  <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedReserva.notas_admin}           
                         {" "}
                  </p>
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
                        {/* Footer del Modal */}           {" "}
            <div className="sticky bottom-0 flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-white">
                            {/* Botón de cerrar */}             {" "}
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                                Cancelar              {" "}
              </button>
                            {/* Botón para guardar el nuevo estado */}         
                 {" "}
              <button
                onClick={handleActualizarEstado}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
              >
                                Actualizar Estado              {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default ReservasManagement;
