# Machine learning basics

## Options to improve weak learners

In general, 2 strategies can be applied to improve weak learners:
- Ensemble learning
- Automated ML

### Ensemble learning
Ensemble learning combines multiple machine learning models to produce one predictive model. There are three main types of ensemble algorithms:

- Bagging or bootstrap aggregation

1. Helps reduce overfitting for models that tend to have high variance (such as decision trees)
2. Uses random subsampling of the training data to produce a bag of trained models.
3. The resulting trained models are homogeneous
4. The final prediction is an average prediction from individual models

- Boosting

1. Helps reduce bias for models.
2. In contrast to bagging, boosting uses the same input data to train multiple models using different hyperparameters.
3. Boosting trains model in sequence by training weak learners one by one, with each new learner correcting errors from previous learners
4. The final predictions are a weighted average from the individual models

- Stacking

1. Trains a large number of completely different (heterogeneous) models
2. Combines the outputs of the individual models into a meta-model that yields more accurate predictions

### Automated ML

ML has many iterative and time-consuming tasks involved in model development (such as selecting the best features, scaling features optimally, choosing the best algorithms, and tuning hyperparameters). Automated ML automates this model building process with greater scale, efficiency, and productivity, while sustaining model quality.

## Reference
1. [Automated ML](https://en.wikipedia.org/wiki/Automated_machine_learning)
2. [Ensemble learning](https://en.wikipedia.org/wiki/Ensemble_learning)

