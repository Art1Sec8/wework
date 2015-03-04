Meteor.publish("userData", function() {
  check(arguments, [Match.Any]);
  if (this.userId) {
    return [
      Users.find({
        _id: this.userId
      }),
      Profiles.find({
        userId: this.userId
      })
    ];
  }
  this.ready();
});

Meteor.publish('jobCount', function() {
  Counts.publish(this, 'jobs', Jobs.find({
    "createdAt": {
      $gte: daysUntilExpiration()
    }
  }));
});

Meteor.publish('developerCount', function() {
  Counts.publish(this, 'developers', Profiles.find());
});

Meteor.publish("homeJobs", function() {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      "createdAt": {
        $gte: daysUntilExpiration()
      }
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10,
      fields: {
        title: true,
        company: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        remote: true,
        jobtype: true
      }
    })
  ];
});


Meteor.publishComposite('homeDevelopers', {
  find: function() {
    return Profiles.find({}, {
      sort: {
        availableForHire: -1,
        randomSorter: 1
      },
      limit: 8,
      fields: {
        userId: true,
        title: true,
        location: true,
        availableForHire: true,
        randomSorter: true,
        type: true,
        name: true
      }
    });
  },
  children: [{
    find: function(profile) {
      return Users.find({
        _id: profile.userId
      }, {
        fields: {
          "emailHash": true,
          "services.facebook.id": true,
          "services.twitter.profile_image_url": true,
          "services.facebook.id": true,
          "services.google.picture": true,
          "services.github.username": true
        }
      });
    }
  }]
});

Meteor.publish("jobs", function() {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      "createdAt": {
        $gte: daysUntilExpiration()
      }
    }, {
      fields: {
        title: true,
        company: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        remote: true,
        jobtype: true
      }
    })
  ];
});

Meteor.publish("my_jobs", function() {
  check(arguments, [Match.Any]);
  if (this.userId) {
    return [
      Jobs.find({
        userId: this.userId
      })
    ];
  }
  this.ready();
});

Meteor.publish("job", function(jobId) {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      _id: jobId
    })
  ];
});

Meteor.publishComposite('profile', function(profileId) {
  return {
    find: function() {
      return Profiles.find({
        _id: profileId
      })
    },
    children: [{
      find: function(profile) {
        return Users.find({
          _id: profile.userId
        }, {
          fields: {
            "emailHash": true,
            "services.facebook.id": true,
            "services.twitter.profile_image_url": true,
            "services.facebook.id": true,
            "services.google.picture": true,
            "services.github.username": true
          }
        });
      }
    }]
  }
});

Meteor.publish("profiles", function() {
  check(arguments, [Match.Any]);
  return [
    Profiles.find({}, {
      fields: {
        userId: true,
        title: true,
        location: true,
        availableForHire: true,
        randomSorter: true,
        type: true,
        name: true
      }
    }),
    Users.find({
      isDeveloper: true
    }, {
      fields: {
        "emailHash": true,
        "services.facebook.id": true,
        "services.twitter.profile_image_url": true,
        "services.facebook.id": true,
        "services.google.picture": true,
        "services.github.username": true
      }
    })
  ];
});
