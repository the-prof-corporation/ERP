const Project = require('../models/projectModel');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('customer', 'name company')
      .populate('manager', 'name email')
      .populate('team', 'name email position');
    
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('customer', 'name company email phone')
      .populate('manager', 'name email position')
      .populate('team', 'name email position');

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      customer,
      startDate,
      endDate,
      status,
      budget,
      team,
      manager,
    } = req.body;

    const project = await Project.create({
      name,
      description,
      customer,
      startDate,
      endDate,
      status,
      budget,
      team,
      manager,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      customer,
      startDate,
      endDate,
      status,
      budget,
      team,
      manager,
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      project.customer = customer || project.customer;
      project.startDate = startDate || project.startDate;
      project.endDate = endDate || project.endDate;
      project.status = status || project.status;
      project.budget = budget || project.budget;
      project.team = team || project.team;
      project.manager = manager || project.manager;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
