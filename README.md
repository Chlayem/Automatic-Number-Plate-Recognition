# Automatic-Number-Plate-Recognition System

![Demo Animation](demo.gif)

## 🌐 Project Context 
This project is developed as my end of studies project at **EnterSoft**.

[Smartvisor](https://smartvisor.tn/fr/index.html), the principal product of **EnterSoft**, is a suite of software solutions that centralizes and automates security and surveillance systems.
One of its key components is the ANPR, which leverages computer vision to automatically read vehicle license plates. 

The existing Smartvisor solution primarily targets desktop **Windows** environments and lacks compatibility with **Linux** systems and **Edge Computing** capabilities. 

This project addresses these challenges by proposing a new architecture that enhances the ANPR system's performance and compatibility.



## 🛠️ Solution
The new architecture introduces a new **web-based approach** built from scratch. 

This solution aligns with **Edge Computer Vision** principles, addressing the critical need for Linux compatibility (a key requirement for most embedded systems).
By processing data closer to the source, the architecture can significantly reduce latency and enhance overall efficiency.

## 🚀 Key Contributions

- **MLOps and Model Integration :**
  - Engaged in MLOps tasks for YOLO models, including annotation and training. Acquired a deep understanding of the YOLO algorithm and the ONNX format, and successfully integrated these models within the .NET environment.

- **Backend Development :**
  - Designed and implemented a comprehensive Web API using ASP.NET Core, guided by Domain-Driven Design (DDD) principles.
- **Video Streaming Solution :**
  - Proposed a tailored solution for video streaming, designed specifically for the new web architecture and capable of managing multiple cameras.
- **Detection Service :**
  - Integrated a detection service capable of handling simultaneous detections, ensuring efficient real-time processing.
- **Frontend Development :**
  - Created a dynamic frontend using React.js to enhance visualisation and user interaction.
- **Testing and Deployment :**
  - Conducted thorough testing and successfully deployed the application on Windows, Linux, and Raspberry Pi.




## 🧰 Technologies and Tools

### 🤖 MLOps and Computer Vision

![YOLO](https://img.shields.io/badge/YOLO-9C27B0?style=for-the-badge&logo=yolo&logoColor=white)  <!-- Not an official badge, example only -->
![CVAT](https://img.shields.io/badge/CVAT-0769AD?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAABWklEQVQ4T62UzUoDQRSG/3dmd2MLi2IiKBSpIiIWsBZeAsWOIiwU0VfwC7i5i6CgIVvBIsbeAgURpYjE2sBE6U9syZPM7d68GZ2Y7Q/DP+fNpAQ/9Fy7Lljk6XhzvSICe1HZmMx6lv6FmVjM/45nh0xLJMt6J/G9JwnPZxSStP0VIrIs5vOZSpSSeN/XSSTPZ1zTNE3zJUmyWzvM4zhoiptlFItFfD7fR0SxLMuKxSJbWZbZbrfbNE1zU9nI5/MgCOB5HhRF2Wx2vV2q1WpV5PN5wuFwu13g8Xj6fT6vV6r2DZ5XIZu92+4/G4z+cnq9frlU6lUh+v12w2XywWkUgkWZZ5PB6v1+tqtVotNptKpVK+Xy+32yVJkiRJkiRJkiRJkiRJkiRJkiRJ0zQ9k1gs1mw2WJaFyWTi8/lsNpvFYjHf7z9AeZ4nhUKhw+FweByGYei6zpPJpN1ul8vlyWSSJEmSJEmSJEmSJEmSJEmSJKmkaZrH43F5nue2bZtIJGL3+0+u67Isy7IWi+XX6/XFYjFWq1Xn8/nFYjE+HwC3261YLJYkSZIkSZIkSZIkacZlMplMJpN0XZfL5RBCoRBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhJCK/X+AAwCZbSbEGd1mKwAAAABJRU5ErkJggg==)  <!-- Not an official badge, example only -->
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![ONNX](https://img.shields.io/badge/ONNX-005CED?style=for-the-badge&logo=onnx&logoColor=white) <!-- Custom Badge -->

- **YOLO (You Only Look Once) :** Utilized for real-time detection (Vehicules, Plates, OCR).
- **CVAT (Computer Vision Annotation Tool) :** Supports the annotation of images to prepare training datasets.
- **Python :** Employed for data preprocessing and model training.
- **ONNX (Open Neural Network Exchange) :** Facilitates the integration of machine learning models with .NET environnment.


### 💻 Web Development

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![.NET](https://img.shields.io/badge/ASP.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SignalR](https://img.shields.io/badge/SignalR-512BD4?style=for-the-badge&logo=signalr&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

- **Frontend :** React.js, ContextAPI for state management and Axios for handling HTTP requests.
- **Backend :** Web API built with ASP.NET Core influenced by DDD (Domain-Driven Desing).
- **Client-Server Communication :** RESTful API (HTTP) for data transfer, SingalR for real-time communication.

### ⚙️ Testing and Deployment 

![WSL](https://img.shields.io/badge/WSL-0A9C25?style=for-the-badge&logo=windows&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi-A22846?style=for-the-badge&logo=raspberry-pi&logoColor=white)


- **Testing :** **WSL** (Windows Subsystem for Linux) was used for continuous testing while working on Windows, targeting deployment on **Linux (Ubuntu)**.
- **Deployment :** The app was deployed successfully on **Windows**, **Ubuntu**, and finally on a **Raspberry Pi 5**.



## 📚 Third-Party Libraries
The following third-party libraries were chosen for their cross-platform compatibility, ensuring the application's functionality across Linux and Windows environments.

- **[Microsoft.ML.OnnxRuntime](https://www.nuget.org/packages/Microsoft.ML.OnnxRuntime)** (Version 1.18.0) : A cross-platform inference and training machine-learning accelerator.
- **[Emgu.CV](https://www.nuget.org/packages/Emgu.CV)** (Version 4.9.0) : A .NET wrapper for OpenCV, used for video processing and image analysis.
- **[Emgu.CV.runtime.windows](https://www.nuget.org/packages/Emgu.CV.runtime.windows)** (Version 4.9.0) : Runtime library for Emgu.CV on Windows.
- **[Emgu.CV.runtime.ubuntu-x64](https://www.nuget.org/packages/Emgu.CV.runtime.ubuntu-x64)** (Version 4.9.0) : Runtime library for Emgu.CV on Ubuntu.
- **[SixLabors.ImageSharp](https://www.nuget.org/packages/SixLabors.ImageSharp/)** (Version 3.1.5) : A cross-platform library for image processing in .NET.
- **[NewtonSoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/)** (Version 13.0.3) : A high-performance JSON framework for .NET, used for JSON serialization.
- **[AutoMapper](https://www.nuget.org/packages/automapper/)** (Version 13.0.1) : Used for mapping between DTO (Data Transfer Objects) and domain models.
- **[YoloDotNet](https://github.com/NickSwardh/YoloDotNet)** (Version 2.0) : Initially, custom code was developed for object detection, but YOLOdotnet was chosen for its extensive capabilities, including Classification, OBB Detection, Segmentation, and Pose Estimation, which may be useful for future enhancements.

