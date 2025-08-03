let video;
let poseNet;
let poses = [];
let prevPoses = {};
let colors = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, () => {
    console.log('PoseNet Ready');
  });
  poseNet.on('pose', function(results) {
    poses = results;
  });

  background(255);
}

function draw() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];

      if (keypoint.score > 0.5) {
        let id = `${i}_${keypoint.part}`;
        let x = keypoint.position.x;
        let y = keypoint.position.y;

        if (!colors[id]) {
          colors[id] = color(random(255), random(255), random(255));
        }

        if (prevPoses[id]) {
          let prev = prevPoses[id];
          let movementSpeed = dist(x, y, prev.x, prev.y);
          let weight = map(movementSpeed, 0, 50, 1, 20);
          stroke(colors[id]);
          strokeWeight(weight);
          line(prev.x, prev.y, x, y);
        }

        prevPoses[id] = {x, y};
      }
    }
  }
}
