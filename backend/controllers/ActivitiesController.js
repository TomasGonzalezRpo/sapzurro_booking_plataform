ActivitiesController.js;

const getActivities = async (req, res) => {
  try {
    // Si usas base de datos
    // const activities = await Activity.find({});

    // Si usas el array estático
    const activities = [
      // ... las actividades definidas arriba
    ];

    res.json({
      success: true,
      data: activities,
      count: activities.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};

const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    // Lógica para buscar actividad por ID
    const activities = activities.find((act) => act.id === id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la actividad",
      error: error.message,
    });
  }
};
