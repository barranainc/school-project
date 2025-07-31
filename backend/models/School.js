const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Contact Information
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      default: 'Administrator'
    }
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'United States'
    }
  },
  
  // School Details
  schoolType: {
    type: String,
    enum: ['daycare', 'montessori', 'private_school', 'public_school', 'preschool'],
    required: [true, 'School type is required']
  },
  gradeLevels: {
    type: [String],
    default: []
  },
  estimatedStudents: {
    type: Number,
    required: [true, 'Estimated number of students is required'],
    min: [1, 'Must have at least 1 student']
  },
  
  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      required: [true, 'Subscription plan is required'],
      default: 'basic'
    },
    status: {
      type: String,
      enum: ['active', 'trial', 'suspended', 'cancelled'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    trialEndDate: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days trial
      }
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  
  // Onboarding Status
  onboardingStatus: {
    type: String,
    enum: ['pending', 'setup', 'live', 'completed'],
    default: 'pending'
  },
  onboardingSteps: {
    profileSetup: { type: Boolean, default: false },
    adminCreated: { type: Boolean, default: false },
    teachersInvited: { type: Boolean, default: false },
    studentsImported: { type: Boolean, default: false },
    firstReportGenerated: { type: Boolean, default: false }
  },
  
  // System Configuration
  settings: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'ar']
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    notifications: {
      emailReports: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true }
    }
  },
  
  // Branding
  branding: {
    logo: String,
    primaryColor: {
      type: String,
      default: '#1976d2'
    },
    secondaryColor: {
      type: String,
      default: '#dc004e'
    },
    customDomain: String
  },
  
  // Usage Statistics
  usage: {
    totalStudents: {
      type: Number,
      default: 0
    },
    totalTeachers: {
      type: Number,
      default: 0
    },
    totalReports: {
      type: Number,
      default: 0
    },
    storageUsed: {
      type: Number,
      default: 0 // in MB
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Notes (for Barrana.ai staff)
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
schoolSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for subscription status
schoolSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.status === 'trial') {
    return this.subscription.trialEndDate > new Date();
  }
  return this.subscription.status === 'active';
});

// Virtual for onboarding progress
schoolSchema.virtual('onboardingProgress').get(function() {
  const steps = Object.values(this.onboardingSteps);
  const completed = steps.filter(step => step).length;
  return Math.round((completed / steps.length) * 100);
});

// Indexes for performance
schoolSchema.index({ slug: 1 });
schoolSchema.index({ 'contactPerson.email': 1 });
schoolSchema.index({ 'subscription.status': 1 });
schoolSchema.index({ isActive: 1 });
schoolSchema.index({ 'subscription.plan': 1 });

// Pre-save middleware to generate slug
schoolSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
    
  next();
});

// Static method to find active schools
schoolSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find schools by subscription status
schoolSchema.statics.findBySubscriptionStatus = function(status) {
  return this.find({ 'subscription.status': status });
};

// Instance method to update usage statistics
schoolSchema.methods.updateUsageStats = function() {
  return this.model('User').countDocuments({ 
    schoolId: this._id, 
    isActive: true 
  }).then(userCount => {
    return this.model('Student').countDocuments({ 
      schoolId: this._id, 
      isActive: true 
    }).then(studentCount => {
      return this.model('Report').countDocuments({ 
        schoolId: this._id 
      }).then(reportCount => {
        this.usage.totalStudents = studentCount;
        this.usage.totalTeachers = userCount;
        this.usage.totalReports = reportCount;
        this.usage.lastActivity = new Date();
        return this.save();
      });
    });
  });
};

module.exports = mongoose.model('School', schoolSchema); 