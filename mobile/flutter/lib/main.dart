import 'package:flutter/material.dart';
void main() => runApp(MyApp());
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Netflix-style Flutter Demo',
      theme: ThemeData(brightness: Brightness.dark, primaryColor: Color(0xFFE50914)),
      home: Scaffold(
        appBar: AppBar(title: Text('Netflix-style Demo')),
        body: Center(child: Text('EN / HI / TE')),
      ),
    );
  }
}
